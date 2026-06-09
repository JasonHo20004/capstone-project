FROM python:3.12-slim AS runtime
WORKDIR /app
ENV PYTHONUNBUFFERED=1
COPY apps/rag-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY apps/rag-service ./
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]