from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import joblib
import numpy as np
from datetime import datetime

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

class Transaction(BaseModel):
    amount: float
    type: str
    category: str
    date: datetime

class Prediction(BaseModel):
    predicted_expenses: float
    savings_recommendation: float
    category_insights: dict

@app.get("/")
async def root():
    return {"message": "Finance AI Service is running"}

@app.post("/predict", response_model=Prediction)
async def predict_expenses(transactions: List[Transaction]):
    try:
        # Simple prediction logic (replace with actual ML model)
        amounts = [t.amount for t in transactions]
        avg_expense = np.mean(amounts)
        predicted_expense = avg_expense * 1.1
        
        return Prediction(
            predicted_expenses=predicted_expense,
            savings_recommendation=avg_expense * 0.2,
            category_insights={
                "high_spending": ["food", "entertainment"],
                "savings_opportunities": ["shopping", "utilities"]
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
