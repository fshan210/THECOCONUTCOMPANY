# Firestore Backup and Restore Guide

This project uses managed Firestore exports to a private Google Cloud Storage bucket.

## Collections Included

`users`, `admins`, `products`, `recipes`, `journal`, `orders`, `wishlist`, `newsletter`, `settings`, `mediaLibrary`, `brandAssets`, `auditLogs`

Secrets are intentionally excluded. Do not store passwords, service account JSON, API secrets, or private keys in Firestore.

## Setup

1. Create a private bucket in Google Cloud Storage, for example `gs://cothecoconutcompany-firestore-backups`.
2. Restrict bucket access to project owners and the backup service account.
3. Set lifecycle retention:
   - daily backups for 30 days
   - monthly backups for 12 months
4. Set `FIRESTORE_BACKUP_BUCKET=gs://<bucket-name>` in the secure environment where the backup runs.

## Dry Run

```bash
npm run firestore:backup
```

## Execute Export

```bash
npm run firestore:backup -- --execute
```

## Restore

Use the Google Cloud CLI from a trusted machine:

```bash
gcloud firestore import gs://<bucket-name>/daily/<timestamp> --project=<project-id>
```

Before restoring production, import into a staging Firebase project and verify customer, admin, product, media, and audit records.

## Scheduling

Preferred low-cost schedule:

```bash
gcloud scheduler jobs create http firestore-daily-export \
  --schedule="0 2 * * *" \
  --uri="https://firestore.googleapis.com/v1/projects/<project-id>/databases/(default):exportDocuments" \
  --http-method=POST \
  --oauth-service-account-email=<backup-service-account>@<project-id>.iam.gserviceaccount.com \
  --message-body='{"outputUriPrefix":"gs://<bucket-name>/daily","collectionIds":["users","admins","products","recipes","journal","orders","wishlist","newsletter","settings","mediaLibrary","brandAssets","auditLogs"]}'
```

Create or schedule this only after approving any Google Cloud costs.
