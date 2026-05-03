from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import health, synthesize
from config import get_settings

settings = get_settings()

app = FastAPI(
    title="TumorBoardPrep API",
    description="Clinical prep tool for oncology tumor boards using watsonx.ai Granite",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(synthesize.router, prefix="/api", tags=["synthesis"])


@app.get("/")
async def root():
    return {
        "message": "TumorBoardPrep API",
        "docs": "/docs",
        "health": "/api/health"
    }

# Made with Bob
