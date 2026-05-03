from pydantic import BaseModel, Field
from typing import Optional


class CaseIntakeRequest(BaseModel):
    presenter: str = Field(..., max_length=80, description="Presenter name and role")
    board_date: str = Field(..., description="Board date in ISO format (YYYY-MM-DD)")
    demographics: str = Field(..., description="Demographics and comorbidities")
    diagnosis: str = Field(..., description="Diagnosis and staging information")
    pathology: str = Field(..., max_length=3000, description="Pathology report excerpts")
    molecular: Optional[str] = Field(default="", max_length=3000, description="Molecular/NGS report excerpts")
    imaging: str = Field(..., max_length=3000, description="Recent imaging report excerpts")
    treatment_timeline: str = Field(..., max_length=3000, description="Chronological treatment history")
    current_status_summary: str = Field(..., max_length=2000, description="Current clinical status")
    clinical_question: str = Field(..., max_length=800, description="Question for the tumor board")

    class Config:
        json_schema_extra = {
            "example": {
                "presenter": "Dr. M. Patel, Heme/Onc Fellow",
                "board_date": "2026-05-06",
                "demographics": "68F, never smoker, ECOG 1. PMHx: T2DM (well-controlled), prior PE on apixaban.",
                "diagnosis": "NSCLC, adenocarcinoma. Initial stage IIIB (T3N2M0) diagnosed Sept 2024.",
                "pathology": "RUL CT-guided biopsy, Sept 2024: Invasive adenocarcinoma, acinar predominant.",
                "molecular": "Initial NGS: EGFR exon 21 L858R mutation. TP53 missense mutation. PD-L1 TPS 5%.",
                "imaging": "CT chest/abdomen/pelvis (April 20, 2026): Increase in RUL primary mass from 2.8 cm to 3.6 cm.",
                "treatment_timeline": "Sept 2024: Diagnosed stage IIIB NSCLC\nOct-Dec 2024: Concurrent chemoradiation",
                "current_status_summary": "Patient reports new mild right-sided pleuritic chest discomfort, worsening fatigue.",
                "clinical_question": "Next-line systemic therapy for EGFR L858R NSCLC progressing on osimertinib."
            }
        }


class SynthesisResponse(BaseModel):
    synthesis: str = Field(..., description="Generated tumor board case card")
    model_used: str = Field(..., description="Granite model ID used for synthesis")
    cached: bool = Field(default=False, description="Whether this was a cached response (Demo Mode)")


class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error message")
    error_type: Optional[str] = Field(None, description="Type of error (auth, rate_limit, timeout, etc.)")

# Made with Bob
