# .CO | The Coconut Company

Premium brand website and API foundation for .CO | The Coconut Company, Palakkad, Kerala.

## Frontend

```bash
npm install
npm run dev
```

Runtime images and video use `NEXT_PUBLIC_MEDIA_BASE_URL`. Production and preview should set it to `https://media.cothecoconutcompany.com`; leaving it empty preserves the local `/public` fallback. Audit, upload, reference scanning, and CloudFront validation are available through the `media:*` npm scripts.

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
