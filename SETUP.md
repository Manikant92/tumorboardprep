# TumorBoardPrep - Extended Setup Guide

This guide is for users who don't have Python or Node.js installed yet. Follow these steps to get TumorBoardPrep running on your machine.

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Install Python 3.11+](#install-python-311)
3. [Install Node.js 18+](#install-nodejs-18)
4. [Install Git](#install-git)
5. [Clone and Configure](#clone-and-configure)
6. [Start the Application](#start-the-application)
7. [Verify Installation](#verify-installation)
8. [Troubleshooting](#troubleshooting)

---

## System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB for dependencies
- **Internet**: Required for initial setup and Try It mode

---

## Install Python 3.11+

### Windows

1. Download Python from https://www.python.org/downloads/
2. Run the installer
3. **Important**: Check "Add Python to PATH" during installation
4. Click "Install Now"
5. Verify installation:
   ```cmd
   python --version
   ```
   Should show: `Python 3.11.x` or higher

### macOS

**Option 1: Using Homebrew (recommended)**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.11
```

**Option 2: Download from python.org**
1. Download from https://www.python.org/downloads/macos/
2. Run the `.pkg` installer
3. Follow the installation wizard

Verify:
```bash
python3 --version
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

Verify:
```bash
python3 --version
```

---

## Install Node.js 18+

### Windows

1. Download Node.js LTS from https://nodejs.org/
2. Run the `.msi` installer
3. Accept defaults and complete installation
4. Verify:
   ```cmd
   node --version
   npm --version
   ```

### macOS

**Option 1: Using Homebrew**
```bash
brew install node@18
```

**Option 2: Download from nodejs.org**
1. Download from https://nodejs.org/
2. Run the `.pkg` installer
3. Follow the wizard

Verify:
```bash
node --version
npm --version
```

### Linux (Ubuntu/Debian)

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:
```bash
node --version
npm --version
```

---

## Install Git

### Windows

1. Download from https://git-scm.com/download/win
2. Run the installer
3. Accept defaults (recommended)
4. Verify:
   ```cmd
   git --version
   ```

### macOS

Git is usually pre-installed. If not:
```bash
brew install git
```

Or download from https://git-scm.com/download/mac

### Linux

```bash
sudo apt install git
```

Verify:
```bash
git --version
```

---

## Clone and Configure

### 1. Clone the Repository

```bash
# Navigate to where you want the project
cd ~/Documents  # or C:\Users\YourName\Documents on Windows

# Clone the repository
git clone <repository-url>
cd tumorboard
```

### 2. Get watsonx.ai Credentials

**You need these for Try It mode (Demo Mode works without them)**

1. Go to https://cloud.ibm.com/
2. Log in or create an IBM Cloud account
3. Navigate to watsonx.ai
4. Create a project or select existing
5. Go to Project Settings → API Keys
6. Copy your:
   - API Key
   - Project ID

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
# On Windows: notepad .env
# On macOS/Linux: nano .env
```

Edit these lines in `.env`:
```
WATSONX_API_KEY=paste_your_api_key_here
WATSONX_PROJECT_ID=paste_your_project_id_here
```

Save and close the file.

---

## Start the Application

### Option 1: Using Make (Recommended)

**Windows**: Install Make first
```cmd
# Using Chocolatey
choco install make

# Or download from https://gnuwin32.sourceforge.net/packages/make.htm
```

**All Platforms**:
```bash
make dev
```

This command:
- Creates Python virtual environment
- Installs backend dependencies
- Installs frontend dependencies
- Starts both backend and frontend
- Opens browser automatically

### Option 2: Manual Start

**Terminal 1 - Backend**:
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend
uvicorn main:app --reload
```

**Terminal 2 - Frontend**:
```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

### Option 3: Using Docker Compose

**Prerequisites**: Install Docker Desktop from https://www.docker.com/products/docker-desktop/

```bash
# Start both services
docker-compose up

# Stop services (Ctrl+C, then):
docker-compose down
```

---

## Verify Installation

### 1. Check Backend

Open http://localhost:8000/api/health

Should see:
```json
{
  "status": "healthy",
  "granite_model": "ibm/granite-4-h-small"
}
```

### 2. Check Frontend

Open http://localhost:5173

Should see:
- TumorBoardPrep header
- Try It / Demo Mode toggle
- Form or demo content

### 3. Test Demo Mode

1. Click "Demo Mode" toggle
2. Should see Case 1 with narrative
3. Wait 8 seconds - should auto-advance to Case 2
4. No errors in browser console (F12)

### 4. Test Try It Mode (Requires API Key)

1. Click "Try It" toggle
2. Click "Load example" → Select "Case 1: EGFR-mutant NSCLC"
3. Click "Generate Case Card"
4. Should see loading spinner
5. After ~10-20 seconds, should see result card

---

## Troubleshooting

### Python Issues

**"python: command not found"**
- Windows: Use `python` instead of `python3`
- Ensure Python is in PATH (reinstall with "Add to PATH" checked)

**"No module named 'venv'"**
```bash
# Ubuntu/Debian
sudo apt install python3.11-venv

# macOS
python3 -m pip install --upgrade pip
```

**Virtual environment won't activate**
- Windows: Run PowerShell as Administrator, then:
  ```powershell
  Set-ExecutionPolicy RemoteSigned
  ```

### Node.js Issues

**"npm: command not found"**
- Restart terminal after Node.js installation
- Check PATH includes Node.js

**"EACCES: permission denied"**
```bash
# Fix npm permissions (macOS/Linux)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### Port Already in Use

**Backend (port 8000)**
```bash
# Find and kill process
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

**Frontend (port 5173)**
```bash
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

### watsonx.ai Errors

**"Authentication failed"**
- Double-check API key in `.env` (no extra spaces)
- Verify API key is active in IBM Cloud console
- Try regenerating API key

**"Rate limit exceeded"**
- Wait 60 seconds before retrying
- Use Demo Mode for demos (works offline)

**"Request timeout"**
- Check internet connection
- watsonx.ai may be experiencing high load
- Try again in a few minutes

### Browser Issues

**Page won't load**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Try different browser (Chrome, Firefox, Edge)

**"Failed to fetch"**
- Check backend is running on port 8000
- Check browser console for CORS errors
- Verify `.env` file exists in backend directory

---

## Next Steps

Once everything is running:

1. **Try Demo Mode first** - No API key needed, works offline
2. **Test Try It mode** - Load an example case and generate
3. **Read the API docs** - Visit http://localhost:8000/docs
4. **Run the test suite** - See [`TESTING.md`](TESTING.md)

---

## Getting Help

If you're still stuck:

1. Check [`TESTING.md`](TESTING.md) for detailed test cases
2. Review error messages carefully
3. Check browser console (F12) for frontend errors
4. Check terminal output for backend errors
5. Open a GitHub issue with:
   - Your OS and versions (Python, Node.js)
   - Full error message
   - Steps to reproduce

---

## Uninstall

To remove TumorBoardPrep:

```bash
# Stop running services (Ctrl+C in terminals)

# Remove project directory
cd ..
rm -rf tumorboard  # or delete folder in File Explorer

# Optional: Remove Python virtual environment
# (already deleted with project directory)

# Optional: Uninstall Python/Node.js
# (only if you don't need them for other projects)
```

---

## Estimated Setup Time

- **With Python/Node.js already installed**: 5 minutes
- **Fresh install (all prerequisites)**: 15-20 minutes
- **First-time users**: 30 minutes (including reading docs)

---

## System Resource Usage

- **Backend**: ~100MB RAM, minimal CPU when idle
- **Frontend**: ~200MB RAM during development
- **Disk**: ~300MB for dependencies
- **Network**: ~1-2MB per Granite API call

---

## Security Notes

- `.env` file contains sensitive credentials - never commit to Git
- API keys are stored locally only
- No patient data is stored or transmitted (except to watsonx.ai during synthesis)
- All example cases are synthetic and fictional

---

## License

MIT License - see [LICENSE](LICENSE) file