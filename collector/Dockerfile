FROM docker.io/library/python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY collect.py .
COPY sources ./sources

ENV PGN_OUTPUT_DIR=/data/pgn

CMD ["python", "collect.py"]
