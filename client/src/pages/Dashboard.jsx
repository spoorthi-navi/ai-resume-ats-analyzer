import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function scorePillClass(score) {
  if (score >= 75) return 'score-pill score-high';
  if (score >= 50) return 'score-pill score-mid';
  return 'score-pill score-low';
}

function Dashboard() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resumes, setResumes] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchResumes = async () => {
    try {
      const res = await API.get('/resume/my-resumes');
      setResumes(res.data);
    } catch (err) {
      console.error('Failed to fetch resumes', err);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUploadAndAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a PDF file first');
      return;
    }
    if (!jobDescription.trim()) {
      setMessage('Please paste a job description first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const uploadRes = await API.post('/resume/upload', formData);
      const resumeId = uploadRes.data.resume.id;

      const analyzeRes = await API.post('/resume/analyze', {
        resumeText: uploadRes.data.text,
        jobDescription,
        resumeId
      });

      setAnalysis(analyzeRes.data);
      setShowModal(true);
      setFile(null);
      fetchResumes();
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data?.error || 'Upload/Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = async (id) => {
    try {
      const res = await API.get(`/resume/${id}`);
      if (res.data.atsScore === null) {
        setMessage('This resume has not been analyzed yet.');
        return;
      }
      setAnalysis({ atsScore: res.data.atsScore, suggestions: res.data.suggestions, penalties: res.data.penalties });
      setShowModal(true);
    } catch (err) {
      setMessage('Could not load this resume.');
    }
  };

  const suggestions = analysis?.suggestions;
  const analysisText = suggestions?.analysis ?? null;

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text('Resume ATS Analysis Report', 14, y);
    y += 12;

    doc.setFontSize(12);
    doc.text(`ATS Score: ${analysis.atsScore}%`, 14, y);
    y += 10;
    if (suggestions?.semanticMatchScore !== undefined) {
      doc.text(`Semantic Match Score: ${suggestions.semanticMatchScore}%`, 14, y);
      y += 10;
    }
    y += 4;

    const addSection = (title, items) => {
      if (!items || items.length === 0) return;
      doc.setFontSize(14);
      doc.text(title, 14, y);
      y += 8;
      doc.setFontSize(11);
      items.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, 180);
        lines.forEach((line) => {
          if (y > 280) { doc.addPage(); y = 20; }
          doc.text(line, 14, y);
          y += 7;
        });
      });
      y += 6;
    };

    if (analysisText) {
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(analysisText, 180);
      lines.forEach((line) => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(line, 14, y);
        y += 7;
      });
    } else {
      if (analysis.penalties?.length > 0) {
        addSection('Critical Fixes', analysis.penalties.map(p => `[${p.priority}] ${p.issue} — ${p.fix}`));
      }
      if (suggestions?.missingSkills?.length > 0) {
        addSection('Missing Skills', suggestions.missingSkills.map(s => `[${s.priority}] ${s.skill} — ${s.reason}`));
      }
      addSection('Optimization Tips', suggestions?.optimizationTips);
      if (suggestions?.bulletRewrites?.length > 0) {
        addSection('Bullet Rewrites', suggestions.bulletRewrites.map(b => `Before: ${b.original}\nAfter: ${b.improved}`));
      }
    }

    doc.save('resume-analysis-report.pdf');
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="card">
          <h3>Upload &amp; analyze a resume</h3>
          <form onSubmit={handleUploadAndAnalyze}>
            <div className="field-group">
              <label className="field-label">Job description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Resume (PDF)</label>
              <input type="file" accept="application/pdf" onChange={handleFileChange} />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Analyzing...' : 'Upload & Analyze'}
            </button>
          </form>
          {message && <p className="error-text">{message}</p>}
        </div>

        {resumes.filter(r => r.atsScore !== null && r.atsScore !== undefined).length >= 2 && (
          <div className="card">
            <h3>Your score over time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={resumes
                  .filter(r => r.atsScore !== null && r.atsScore !== undefined)
                  .slice()
                  .reverse()
                  .map(r => ({
                    date: new Date(r.createdAt).toLocaleDateString(),
                    score: r.atsScore
                  }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#1d4e89" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="card">
          <h3>Your resumes</h3>
          {resumes.length === 0 ? (
            <p style={{ color: '#6b7280' }}>Nothing uploaded yet — your history will appear here.</p>
          ) : (
            <ul className="resume-list">
              {resumes.map((r) => (
                <li key={r._id} className="resume-item" onClick={() => handleViewResume(r._id)}>
                  <span className="date">{new Date(r.createdAt).toLocaleString()}</span>
                  {r.atsScore !== null && r.atsScore !== undefined ? (
                    <span className={scorePillClass(r.atsScore)}>{r.atsScore}%</span>
                  ) : (
                    <span className="score-pill" style={{ background: '#f3f4f6', color: '#6b7280' }}>Not analyzed</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {showModal && analysis && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2>Analysis Report</h2>

              <div className="gauges-row">
                <div className="gauge-box">
                  <div className="num" style={{ color: analysis.atsScore >= 75 ? '#16a34a' : analysis.atsScore >= 50 ? '#ca8a04' : '#dc2626' }}>
                    {analysis.atsScore}%
                  </div>
                  <div className="lbl">ATS Score</div>
                </div>
                {suggestions?.semanticMatchScore !== undefined && (
                  <div className="gauge-box">
                    <div className="num" style={{ color: suggestions.semanticMatchScore >= 75 ? '#16a34a' : suggestions.semanticMatchScore >= 50 ? '#ca8a04' : '#dc2626' }}>
                      {suggestions.semanticMatchScore}%
                    </div>
                    <div className="lbl">Semantic Match</div>
                  </div>
                )}
              </div>

              {analysisText ? (
                <p>{analysisText}</p>
              ) : (
                <>
                  {analysis.penalties?.length > 0 && (
                    <div className="penalty-box">
                      <h4 style={{ marginTop: 0, color: '#dc2626' }}>Critical fixes</h4>
                      <ul className="plain-list">
                        {analysis.penalties.map((p, i) => (
                          <li key={i}>
                            <span className={`priority-tag priority-${p.priority}`}>{p.priority}</span>
                            {p.issue} — <em>{p.fix}</em>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <h4>Missing skills</h4>
                  <ul className="plain-list">
                    {suggestions?.missingSkills
                      ?.slice()
                      .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]))
                      .map((s, i) => (
                        <li key={i}>
                          <span className={`priority-tag priority-${s.priority}`}>{s.priority}</span>
                          {s.skill} — <span style={{ color: '#6b7280' }}>{s.reason}</span>
                        </li>
                      ))}
                  </ul>

                  <h4>Optimization tips</h4>
                  <ul className="plain-list">
                    {suggestions?.optimizationTips?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>

                   <h4>Bullet point rewrites</h4>
                  {suggestions?.bulletRewrites?.map((b, i) => (
                    <div key={i} className="rewrite-card">
                      <p className="before">Before: {b.original}</p>
                      <p className="after">After: {b.improved}</p>
                    </div>
                  ))}

                  {suggestions?.predictedQuestions?.length > 0 && (
                    <>
                      <h4>Likely interview questions</h4>
                      <ul className="plain-list">
                        {suggestions.predictedQuestions.map((q, i) => (
                          <li key={i} style={{ marginBottom: '14px' }}>
                            <span
                              className="priority-tag"
                              style={{
                                background: q.reason === 'gap' ? '#fee2e2' : '#dcfce7',
                                color: q.reason === 'gap' ? '#dc2626' : '#16a34a'
                              }}
                            >
                              {q.reason === 'gap' ? 'probing gap' : 'probing strength'}
                            </span>
                            <strong>{q.question}</strong>
                            <br />
                            <span style={{ color: '#6b7280', fontSize: '13px' }}>💡 {q.tip}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}

              <div className="modal-actions">
                <button className="btn" onClick={handleDownloadReport}>Download PDF report</button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;