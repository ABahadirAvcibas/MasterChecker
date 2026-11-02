from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from openai import OpenAIError

from llm_service import analyze_with_llm


app = FastAPI(
    title="Master Checker",
    version="0.1.0"
)


class AnalyzeRequest(BaseModel):
    user_prompt: str = Field(min_length=1)
    page_text: str = Field(min_length=1)
    page_url: str | None = None

    temperature: float = Field(
        default=0.6,
        ge=0.0,
        le=1.2
    )

    top_p: float = Field(
        default=0.95,
        ge=0.1,
        le=1.0
    )


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "MasterChecker"
    }


@app.post("/analyze")
def analyze(request: AnalyzeRequest):

    try:
        result = analyze_with_llm(
            user_prompt=request.user_prompt,
            page_text=request.page_text,
            temperature=request.temperature,
            top_p=request.top_p
        )

    except (OpenAIError, ValueError) as error:
        raise HTTPException(
            status_code=502,
            detail="LLM analysis failed."
        ) from error

    return {
        "status": "success",
        "analysis_available": True,
        "page_url": request.page_url,
        **result
    }


# Deneme amaçlı
@app.get("/Name")
def app_name():
    return {
        "app_name": "Master Program Eligibility"
    }