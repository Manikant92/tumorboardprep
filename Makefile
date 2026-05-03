.PHONY: help dev install-backend install-frontend clean

help:
	@echo "TumorBoardPrep - Development Commands"
	@echo ""
	@echo "  make dev              Start backend and frontend concurrently"
	@echo "  make install-backend  Install Python dependencies"
	@echo "  make install-frontend Install Node dependencies"
	@echo "  make clean            Remove generated files and caches"
	@echo ""

dev:
	@echo "Starting TumorBoardPrep in development mode..."
	@echo "Backend will run on http://localhost:8000"
	@echo "Frontend will run on http://localhost:5173"
	@echo ""
	@if [ ! -f .env ]; then \
		echo "ERROR: .env file not found. Copy .env.example to .env and configure it."; \
		exit 1; \
	fi
	@command -v python3 >/dev/null 2>&1 || { echo "ERROR: python3 not found. Install Python 3.11+"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "ERROR: node not found. Install Node 18+"; exit 1; }
	@if [ ! -d backend/venv ]; then \
		echo "Creating Python virtual environment..."; \
		python3 -m venv backend/venv; \
	fi
	@if [ ! -f backend/venv/bin/activate ]; then \
		echo "ERROR: Virtual environment creation failed"; \
		exit 1; \
	fi
	@echo "Installing backend dependencies..."
	@. backend/venv/bin/activate && pip install -q -r backend/requirements.txt
	@if [ ! -d frontend/node_modules ]; then \
		echo "Installing frontend dependencies..."; \
		cd frontend && npm install; \
	fi
	@echo ""
	@echo "Starting services..."
	@trap 'kill 0' INT; \
	(cd backend && . venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload) & \
	(cd frontend && npm run dev) & \
	wait

install-backend:
	@echo "Installing backend dependencies..."
	@python3 -m venv backend/venv
	@. backend/venv/bin/activate && pip install -r backend/requirements.txt
	@echo "Backend dependencies installed."

install-frontend:
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install
	@echo "Frontend dependencies installed."

clean:
	@echo "Cleaning generated files..."
	@rm -rf backend/venv
	@rm -rf backend/__pycache__
	@rm -rf backend/**/__pycache__
	@rm -rf frontend/node_modules
	@rm -rf frontend/dist
	@echo "Clean complete."

# Made with Bob
