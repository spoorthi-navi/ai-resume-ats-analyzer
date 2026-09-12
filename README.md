# 🎯 AI Resume ATS Analyzer

A full-stack **MERN-based AI Resume ATS Analyzer** that evaluates resumes against job descriptions and provides an ATS compatibility score, AI-powered optimization suggestions, missing-skill analysis, bullet-point improvements, and interview preparation.

The application helps job seekers understand how well their resume matches a particular job and what they can improve before applying.

---

## ✨ Features

### 🔐 JWT Authentication

* Secure user registration and login
* JWT-based authentication
* Protected application routes
* User-specific analysis history

### 📄 Resume PDF Upload

* Upload resumes in PDF format
* Extract resume text using `pdfjs-dist`
* Resume files are processed in memory
* No permanent disk storage required for uploaded resumes

### 🎯 ATS Keyword Score

* Compares resume keywords with keywords from the job description
* Calculates a percentage-based ATS keyword match score
* Helps identify important keywords missing from the resume

### 🧠 AI Semantic Match Score

* Uses Google Gemini AI to evaluate semantic similarity
* Goes beyond exact keyword matching
* Understands related skills and job terminology
* Example:

  * **"Python Developer"**
  * **"Software Engineer with Python experience"**
* These can be recognized as semantically related even when the exact wording differs.

### ⚠️ Prioritized Missing Skills

Gemini AI identifies skills missing from the resume and categorizes them by priority:

* 🔴 **High Priority**
* 🟠 **Medium Priority**
* 🟢 **Low Priority**

Each missing skill includes reasoning to help users understand its importance.

### 🚫 Critical ATS Fix Detection

Rule-based checks identify common resume issues that can negatively affect ATS compatibility, including:

* Missing email address
* Missing phone number
* Missing dates
* Missing standard section headers
* Other common ATS formatting/rejection triggers

### ✍️ AI Bullet Point Rewrites

* Identifies vague or weak resume bullet points
* Rewrites them into stronger achievement-oriented statements
* Encourages measurable and impact-driven descriptions

### 🎤 Interview Question Prediction

Generates likely interview questions based on:

* Resume strengths
* Missing skills
* Job requirements
* Candidate experience

It also provides preparation tips for the predicted questions.

### 📊 Analysis History

* Saves previous resume analyses
* Allows users to revisit previous results
* Keeps analysis data associated with the authenticated user

### 📈 ATS Score Trend

* Displays ATS score changes across multiple resume versions
* Uses interactive charts to visualize improvement
* Helps users track resume optimization over time

### 📥 PDF Report Export

* Generate a complete analysis report
* Export analysis results as a PDF
* Useful for reviewing or sharing resume improvement suggestions

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| React        | User interface                  |
| Vite         | Frontend development/build tool |
| React Router | Client-side routing             |
| Axios        | API communication               |
| Recharts     | ATS score and analytics charts  |
| jsPDF        | PDF report generation           |

### Backend

| Technology | Purpose                  |
| ---------- | ------------------------ |
| Node.js    | Backend runtime          |
| Express.js | REST API framework       |
| ES Modules | JavaScript module system |
| MongoDB    | Database                 |
| Mongoose   | MongoDB object modeling  |
| JWT        | Authentication           |
| Multer     | File upload handling     |
| pdfjs-dist | PDF text extraction      |

### AI

| Technology        | Purpose                             |
| ----------------- | ----------------------------------- |
| Google Gemini API | Resume and job-description analysis |
| Gemini REST API   | Communication with the AI model     |

---

## 🏗️ Project Architecture

```text
resume-ats-analyzer/
│
├── client/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── server/                         # Node.js + Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ How It Works

The application follows this workflow:

```text
User
  │
  ▼
Upload Resume + Job Description
  │
  ▼
React Frontend
  │
  ▼
Express Backend
  │
  ├── Extract Resume Text
  │
  ├── Calculate Keyword ATS Score
  │
  └── Send Resume + Job Description to Gemini
  │
  ▼
Gemini AI Analysis
  │
  ├── Semantic Match Score
  ├── Missing Skills
  ├── Optimization Suggestions
  ├── Bullet Point Rewrites
  └── Interview Questions
  │
  ▼
MongoDB
  │
  ▼
Interactive Analysis Dashboard
  │
  ├── ATS Score
  ├── AI Analysis
  ├── Missing Skills
  ├── Suggestions
  ├── Interview Preparation
  └── Score Trends
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd resume-ats-analyzer
```

---

# 🔧 Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

### Create Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ **Important:** Never upload your `.env` file or API keys to GitHub.

Add the following to `.gitignore` if it is not already present:

```gitignore
node_modules/
.env
```

### Start the Backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local URL provided by Vite, typically:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

The backend requires the following environment variables:

| Variable         | Description                        |
| ---------------- | ---------------------------------- |
| `PORT`           | Port used by the Express server    |
| `MONGO_URI`      | MongoDB connection string          |
| `JWT_SECRET`     | Secret key used to sign JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key              |

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📋 Application Workflow

### Step 1 — Create an Account

Users register and log in securely using JWT authentication.

### Step 2 — Upload Resume

The user uploads their resume in PDF format.

### Step 3 — Add Job Description

The user pastes the job description they want to target.

### Step 4 — Resume Processing

The backend extracts text from the uploaded PDF using `pdfjs-dist`.

### Step 5 — ATS Analysis

The application calculates a keyword-based ATS compatibility score.

### Step 6 — AI Analysis

Gemini analyzes the resume and job description to provide:

* Semantic match score
* Missing skills
* Skill priorities
* Resume optimization suggestions
* Bullet-point improvements
* Predicted interview questions

### Step 7 — View Results

The results are displayed through an interactive dashboard.

### Step 8 — Save Analysis

The analysis is stored in MongoDB so the user can access it later.

### Step 9 — Track Progress

Users can compare previous analyses and view ATS score trends.

### Step 10 — Export Report

Users can download a PDF report containing their analysis results.

---

## 📊 Main Dashboard

The dashboard provides an overview of the resume analysis, including:

* 🎯 ATS Keyword Score
* 🧠 Semantic Match Score
* ⚠️ Missing Skills
* 🚫 Critical ATS Issues
* ✍️ Suggested Bullet Rewrites
* 💡 Optimization Suggestions
* 🎤 Interview Questions
* 📈 Score Improvement Trends

---

## 🔒 Security

The application implements several security measures:

* JWT-based authentication
* Protected API routes
* Password authentication
* Environment variables for sensitive credentials
* `.env` excluded from Git
* User-specific analysis history

---

## 📌 Key Highlights

* Full-stack **MERN application**
* AI-powered resume analysis
* PDF resume processing
* ATS keyword matching
* Semantic similarity analysis
* Personalized improvement suggestions
* Interview preparation
* Historical analysis tracking
* Data visualization
* PDF report generation

---

## 🔮 Future Enhancements

Possible future improvements include:

* Support for DOCX resumes
* Resume templates
* Multiple job-description comparisons
* LinkedIn profile analysis
* More detailed resume formatting analysis
* Resume section scoring
* Job recommendation system
* Industry-specific ATS scoring
* Dark mode
* Deployment with a production database and cloud hosting

---

## 👩‍💻 Author

**Spoorthi**

Built as part of an **NxtWave course project** to demonstrate full-stack development, AI integration, authentication, data visualization, and practical resume optimization.

---

## ⭐ Project Goal

The goal of **AI Resume ATS Analyzer** is to help job seekers understand how their resume performs against a specific job description and provide actionable, AI-powered recommendations to improve their chances of getting through Applicant Tracking Systems (ATS).

---

## 📄 License

This project was developed for educational and learning purposes.
