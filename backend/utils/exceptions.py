from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
import logging
import traceback

logger = logging.getLogger(__name__)

async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for the application"""
    logger.error(f"Global exception handler caught: {exc}", exc_info=True)
    
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail}
        )
    
    # Log the full traceback for debugging
    logger.error(f"Unexpected error: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error", 
            "detail": "An unexpected error occurred. Please try again later."
        }
    )

from typing import Optional

class ValidationError(Exception):
    """Custom validation error"""
    def __init__(self, message: str, field: Optional[str] = None):
        self.message = message
        self.field = field
        super().__init__(message)

class ModelError(Exception):
    """Custom model prediction error"""
    def __init__(self, message: str, model_type: Optional[str] = None):
        self.message = message
        self.model_type = model_type
        super().__init__(message)