from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="Finance AI Service",
    description="AI-powered financial analysis and predictions",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    user_id: str
    transaction_history: List[dict]
    prediction_months: int = 3

class PredictionResponse(BaseModel):
    predicted_expenses: List[float]
    confidence_score: float
    categories: List[str]

@app.get("/")
async def root():
    return {"message": "Finance AI Service is running"}

@app.post("/predict/expenses", response_model=PredictionResponse)
async def predict_expenses(request: PredictionRequest):
    try:
        # Placeholder for ML model prediction
        # TODO: Implement actual ML model
        return PredictionResponse(
            predicted_expenses=[1000.0, 1100.0, 1200.0],
            confidence_score=0.85,
            categories=["Food", "Transport", "Entertainment"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
