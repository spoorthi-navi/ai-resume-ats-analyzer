import dotenv from 'dotenv';
dotenv.config();

const buildPrompt = (resumeText, jobDescription) => `
You are an ATS resume analyzer and interview coach.
Return STRICT JSON only.
Do not wrap in markdown.
Do not include backticks.
Do not include explanations.
Use this exact schema:
{
  "semanticMatchScore": number (0-100, how well the resume's experience and skills semantically match the job description, even if exact keywords differ — e.g. "Python Developer" should be recognized as matching "Software Engineer with Python experience"),
  "missingSkills": [
    { "skill": "string", "priority": "high" | "medium" | "low", "reason": "string explaining why this matters for this specific job" }
  ],
  "optimizationTips": ["string"],
  "bulletRewrites": [
    { "original": "a real bullet point or phrase found in the resume", "improved": "a rewritten, metric-driven version of it" }
  ],
  "predictedQuestions": [
    { "question": "string", "reason": "gap" | "strength", "tip": "string — a short tip on how to answer or prepare for this specific question" }
  ]
}

Rank missingSkills by priority: "high" for core required skills explicitly mentioned in the job description, "medium" for secondary/nice-to-have skills, "low" for minor or optional items.

For bulletRewrites, pick 2-4 actual bullet points from the resume that sound passive or vague, and rewrite them to be metric-driven and impactful (e.g. "Responsible for sales" becomes "Grew regional sales revenue by 18% over two quarters").

For predictedQuestions, generate 4-6 realistic interview questions this specific candidate would likely be asked for this specific job. Base half of them on gaps (missing skills, thin experience areas) — the interviewer probing weak spots — and half on strengths (a standout project, technology, or achievement in the resume) — the interviewer wanting more detail. Mark each with "reason": "gap" or "strength" accordingly.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;
export const analyzeWithGemini = async (resumeText, jobDescription) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is undefined');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(resumeText, jobDescription) }] }],
          generationConfig: { temperature: 0.2 }
        })
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Empty Gemini response');
    }

    try {
      const parsed = JSON.parse(
        rawText.replace(/```json/g, '').replace(/```/g, '').trim()
      );
      return parsed;
    } catch {
      return { analysis: rawText };
    }
  } catch (err) {
    return { error: err.message };
  }
};