# --- Stage 1: Build React frontend ---
FROM node:18 AS frontend
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build backend image ---
FROM python:3.11-slim
WORKDIR /app

# Install OS dependencies (optional)
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend source
COPY backend/ ./backend

# Copy frontend build from previous stage
COPY --from=frontend /app/frontend/build ./backend/frontend_build

# Expose port
ENV PORT=8000
EXPOSE 8000

# Start FastAPI
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]
