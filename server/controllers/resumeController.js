import Resume from '../models/Resume.js';
import extractTextFromPDF from '../utils/pdfParser.js';
import { extractKeywords } from '../utils/keywordExtractor.js';
import { calculateATSScore } from '../utils/atsScore.js';
import { analyzeWithGemini } from '../utils/aiAnalyzer.js';
import { checkPenalties } from '../utils/penaltyChecker.js';

export async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const text = await extractTextFromPDF(req.file.buffer);

    const resume = new Resume({
      userId: req.user.userId,
      text
    });
    await resume.save();

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: { id: resume._id, createdAt: resume.createdAt },
      text
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function getMyResumes(req, res) {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .select('-text')
      .sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function analyzeResume(req, res) {
  try {
    const { resumeText, jobDescription, resumeId } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Missing resumeText or jobDescription' });
    }

    const jdKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);

    const atsScore = calculateATSScore(jdKeywords, resumeKeywords);
    const suggestions = await analyzeWithGemini(resumeText, jobDescription);
    const penalties = checkPenalties(resumeText);

    if (resumeId) {
      await Resume.findOneAndUpdate(
        { _id: resumeId, userId: req.user.userId },
        { atsScore, suggestions, penalties, jobDescription }
      );
    }

    res.json({ atsScore, suggestions, penalties });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function getResumeById(req, res) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}