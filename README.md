# .CO | The Coconut Company

Premium brand website and API foundation for .CO | The Coconut Company, Palakkad, Kerala.

## Frontend

```bash
npm install
npm run dev
```

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Set `DATABASE_URL` to the AWS RDS PostgreSQL connection string.
