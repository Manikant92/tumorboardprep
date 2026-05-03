# TumorBoardPrep

**Clinical prep tool for oncology tumor boards powered by watsonx.ai Granite**

TumorBoardPrep helps oncology fellows synthesize complex case data into structured one-page tumor board presentations. Paste raw clinical inputs from EHR, pathology, NGS, and imaging reports—Granite generates a formatted case card in seconds.

---

## Features

- **Try It Mode**: Real-time synthesis with watsonx.ai Granite
  - 8-field form matching clinical workflow
  - Load example cases with one click
  - Copy-as-markdown for easy sharing
  - Print-friendly output

- **Demo Mode**: Guided walkthrough for first-time visitors
  - Three pre-built synthetic cases
  - Auto-advance presentation
  - Works offline (no API key needed)
  - Perfect for judges and demos

- **Production Quality**
  - Resilient error handling (auth, rate limits, timeouts)
  - Form validation with character limits
  - Loading and empty states
  - Accessibility-friendly design

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- watsonx.ai account with API key (for Try It mode)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tumorboard
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your watsonx credentials:
   # WATSONX_API_KEY=your_key_here
   # WATSONX_PROJECT_ID=your_project_id_here
   ```

3. **Start the application**
   ```bash
   make dev
   ```

4. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

That's it! The app is running.

---

## Usage

### Try It Mode (Real Synthesis)

1. Switch to "Try It" mode in the header
2. Fill in the 8 case fields, or click "Load example" to pre-fill
3. Click "Generate Case Card"
4. Wait ~10-20 seconds for Granite synthesis
5. Review the structured output
6. Click "Copy as Markdown" to share

### Demo Mode (Offline Walkthrough)

1. Switch to "Demo Mode" in the header
2. Watch the guided walkthrough of 3 synthetic cases
3. Auto-advances every 8 seconds, or use Next/Previous
4. Click "Restart" to reset
5. No API key required—works offline

---

## Tech Stack

**Backend**
- Python 3.11, FastAPI, uvicorn
- httpx for watsonx.ai REST API calls
- Pydantic v2 for validation
- python-dotenv for config

**Frontend**
- React 18, Vite
- Tailwind CSS for styling
- react-markdown for rendering

**AI**
- watsonx.ai Granite (`ibm/granite-4-h-small`)
- Direct REST API integration (no SDK)
- Temperature 0.3, max 800 tokens

---

## Project Structure

```
tumorboard/
├── backend/              # FastAPI application
│   ├── main.py          # App entry point
│   ├── config.py        # Environment loader
│   ├── models.py        # Pydantic schemas
│   ├── granite_client.py # watsonx.ai client
│   ├── routes/          # API endpoints
│   └── utils/           # Prompt loader
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── data/        # Example cases
│   │   └── App.jsx      # Root component
│   └── public/
├── docs/                # Reference files
│   ├── intake_form.json # Form schema
│   ├── granite_system_prompt.md # AI prompt
│   └── case_*.json      # Example cases
├── Makefile             # One-command dev
├── docker-compose.yml   # Alternative setup
└── TESTING.md           # Test guide
```

---

## Screenshots

### Try It Mode
```
[Screenshot placeholder: Form with 8 fields and Load example dropdown]
[Screenshot placeholder: Generated case card with Copy button]
```

### Demo Mode
```
[Screenshot placeholder: Guided walkthrough with Case 1/3 indicator]
[Screenshot placeholder: Auto-advance timer and navigation buttons]
```

---

## Development

### Run backend only
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Run frontend only
```bash
cd frontend
npm install
npm run dev
```

### Run with Docker Compose
```bash
docker-compose up
```

### Run tests
See [`TESTING.md`](TESTING.md) for comprehensive test suite.

---

## API Reference

### POST /api/synthesize
Synthesize a tumor board case card from raw clinical inputs.

**Request Body:**
```json
{
  "presenter": "Dr. M. Patel, Heme/Onc Fellow",
  "board_date": "2026-05-06",
  "demographics": "68F, never smoker, ECOG 1...",
  "diagnosis": "NSCLC, adenocarcinoma...",
  "pathology": "RUL CT-guided biopsy...",
  "molecular": "EGFR L858R mutation...",
  "imaging": "CT chest/abdomen/pelvis...",
  "treatment_timeline": "Sept 2024: Diagnosed...",
  "current_status_summary": "Patient reports...",
  "clinical_question": "Next-line systemic therapy..."
}
```

**Response:**
```json
{
  "synthesis": "**Anonymous case, 68F — presented by...",
  "model_used": "ibm/granite-4-h-small",
  "cached": false
}
```

**Error Codes:**
- `401`: Invalid API key
- `429`: Rate limit exceeded
- `504`: Request timeout
- `500`: Synthesis error

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "granite_model": "ibm/granite-4-h-small"
}
```

---

## Troubleshooting

### "Authentication failed" error
- Check `WATSONX_API_KEY` in `.env`
- Verify API key is valid in watsonx.ai console
- Ensure no extra spaces or quotes

### "Rate limit exceeded" error
- Wait 60 seconds before retrying
- watsonx.ai has rate limits per account
- Demo Mode works offline if you need to demo

### Frontend won't start
- Run `npm install` in frontend directory
- Check Node.js version: `node --version` (need 18+)
- Try deleting `node_modules` and reinstalling

### Backend won't start
- Check Python version: `python --version` (need 3.11+)
- Activate virtual environment first
- Check `.env` file exists

---

## License

MIT License - see [LICENSE](LICENSE) file

---

## Disclaimer

**Editorial prep tool for human oncologist review. Not a clinical decision support system. Not for diagnostic use.**

All example cases are synthetic and fictional. No real patient data is used.

---

## Acknowledgments

Built for the IBM Bob Dev Day Hackathon using:
- watsonx.ai Granite for AI synthesis
- FastAPI for backend
- React for frontend
- Tailwind CSS for styling

---

## Contact

For questions or issues, please open a GitHub issue.