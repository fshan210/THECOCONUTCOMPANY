# .CO FastAPI Backend

FastAPI foundation configured for AWS RDS PostgreSQL through `DATABASE_URL`.

## Local setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Use an RDS connection string shaped like:

```text
postgresql+psycopg://USER:PASSWORD@RDS_ENDPOINT:5432/DATABASE
```

Health endpoints:

- `GET /api/v1/health`
- `GET /api/v1/db/health`
