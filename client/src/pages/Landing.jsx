import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Landing() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{ textAlign: 'center', padding: '40px 0 50px' }}>
          <h1 style={{ fontSize: '38px', lineHeight: 1.2, margin: '0 0 16px' }}>
            Know exactly why your resume gets rejected
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '520px', margin: '0 auto 28px' }}>
            Upload your resume and a job description. Get an ATS compatibility score,
            a semantic match check, and specific line-by-line fixes — powered by AI.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link to="/register"><button className="btn">Get started — it's free</button></Link>
            <Link to="/login"><button className="btn btn-secondary">Log in</button></Link>
          </div>
        </div>

        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Why use this checker</h3>
        <div className="feature-grid" style={{ marginBottom: '48px' }}>
          <div className="feature-card">
            <h4>ATS keyword score</h4>
            <p>See the exact percentage of job-description keywords your resume is missing.</p>
          </div>
          <div className="feature-card">
            <h4>Semantic match</h4>
            <p>Recognizes equivalent experience even when the exact wording differs.</p>
          </div>
          <div className="feature-card">
            <h4>Critical fixes, prioritized</h4>
            <p>Flags missing contact info, dates, and section headers that get resumes auto-rejected.</p>
          </div>
          <div className="feature-card">
            <h4>Rewritten bullet points</h4>
            <p>Turns vague duties into specific, metric-driven achievements.</p>
          </div>
        </div>

        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>How it works</h3>
        <div className="card">
          <div className="step-row">
            <div className="step-num">1</div>
            <div>
              <h4>Upload your resume</h4>
              <p>Upload a PDF and paste in the job description you're targeting.</p>
            </div>
          </div>
          <div className="step-row">
            <div className="step-num">2</div>
            <div>
              <h4>Get your score</h4>
              <p>Instantly see your ATS keyword score and AI semantic match score.</p>
            </div>
          </div>
          <div className="step-row">
            <div className="step-num">3</div>
            <div>
              <h4>Review prioritized fixes</h4>
              <p>See critical issues, missing skills, and rewritten bullet points — ranked by what matters most.</p>
            </div>
          </div>
          <div className="step-row">
            <div className="step-num">4</div>
            <div>
              <h4>Download your report</h4>
              <p>Export a full PDF report to track improvements across every version.</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '48px 0 20px' }}>
          <h3 style={{ marginBottom: '16px' }}>Ready to check your resume?</h3>
          <Link to="/register"><button className="btn">Get started — it's free</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;