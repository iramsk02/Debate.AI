# Debate.AI - AI Ethics Project

An interactive AI-driven debate platform. This project uses LangChain and Groq (LLM) to simulate dialectic debates between two AI agents (Pro and Con) with a neutral AI judge providing ethical audits.

## Project Structure
- `main.py`: FastAPI backend server handling LLM logic and streaming.
- `src/`: React frontend focused on a premium, minimalist architectural UI.
- `main.ipynb`: Research and testing notebook.

---

## 🚀 Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Groq API Key**: Obtain from [Groq Console](https://console.groq.com/)

### 2. Backend Setup (FastAPI)
Navigate to the root directory and set up the Python environment:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create a .env file in the root if it doesn't exist and add:
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Frontend Setup (React + Vite)
In a new terminal window:

```bash
# Install NPM dependencies
npm install
```

---

## 🛠 Running the Application

To run the full application, you need to start both the backend and frontend.

### Step 1: Start Backend
```bash
# Ensure venv is activated
uvicorn main:app --reload --port 8000
```
The backend will be available at `http://127.0.0.1:8000`.

### Step 2: Start Frontend
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## 🧠 Features
- **Structural Dialectic**: Dynamic streaming of arguments between two AI personas.
- **Ethical Audit**: Final judgment includes analysis of **Ethical Soundness** and **Unethical Risks (Moral Hazards)** for both sides.
- **Complexity Control**: Adjustable debate rounds (1, 2, 3, or 5) for deeper analysis.
- **Premium UI**: Minimalist black-and-white aesthetic with fluid animations using Framer Motion and Lucide icons.

## ⚖ Ethics Focus
This project demonstrates the application of ethical frameworks in AI decision-making, specifically exploring:
- Logical consistency in argumentation.
- Identification of biases and moral hazards.
- Dialectic synthesis of opposing viewpoints.
