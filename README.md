🎯 AI Resume ATS Analyzer
A full-stack MERN application that analyzes resumes against job descriptions, providing an ATS compatibility score, AI-powered suggestions, and interview preparation — all in one place.

✨ Features
Feature	Description
🔐 JWT Authentication -Secure register/login with protected routes
📄 PDF Resume Upload-Text extraction via pdfjs-dist, stored in memory (no disk writes)
🎯 ATS Keyword Score- Percentage match between resume and job description keywords
🧠 Semantic Match Score	AI-judged similarity beyond exact keywords — recognizes "Python Developer" ≈ "Software Engineer with Python experience"
⚠️ Prioritized Missing Skills-Ranked high/medium/low with reasoning, powered by Gemini AI
🚫 Critical Fix Detection	Rule-based checks for common ATS rejection triggers (missing email, phone, dates, section headers)
✍️ Bullet Point Rewrites- Turns vague duties into metric-driven achievements
🎤 Interview Question Prediction -Likely questions based on resume gaps and strengths, with prep tips
📊 Analysis History	Every past analysis is saved and revisitable
📈 Score Trend Chart- Visualizes ATS score improvement across multiple resume versions
📥 PDF Report Export- Download a full analysis report
🛠️ Tech Stack

Frontend: React (Vite) · React Router · Axios · Recharts · jsPDF Backend: Node.js · Express (ES Modules) · MongoDB + Mongoose · JWT · Multer AI: Google Gemini API (REST)

📁 Project Structure
resume-ats-analyzer/
├── client/          # React frontend
└── server/          # Express backend
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
🚀 Setup
Backend
bash
cd server
npm install

Create a .env file in server/:

env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
bash
npm run dev
Frontend
bash
cd client
npm install
npm run dev
⚙️ How It Works
📤 User uploads a resume (PDF) and pastes a job description
🔍 Backend extracts resume text and calculates a keyword-based ATS score
🤖 Gemini AI analyzes both texts for semantic match, missing skills, optimization tips, bullet rewrites, and predicted interview questions
💾 Results are saved to the database and displayed in an interactive report, with an option to download as PDF
👩‍💻 Author

Built by Spoorthi as part of an NxtWave course project.