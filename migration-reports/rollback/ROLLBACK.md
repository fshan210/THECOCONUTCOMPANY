# Runtime media rollback

The migration is reversible without restoring or deleting any S3 object. The S3 bucket is versioned, retained by CloudFormation, private, and is not part of the application rollback path.

## Fast application rollback

The preserved last-known-good production deployment is:

`https://my-website-g0be7dhj5-fazil-s-projects1.vercel.app`

It returned HTTP 200 after the migration deployment and remains available for rollback.

1. Run `npx vercel rollback my-website-g0be7dhj5-fazil-s-projects1.vercel.app --yes` from the linked repository.
2. Wait for the rollback to complete, then confirm both the immutable deployment and `https://cothecoconutcompany.com`.
3. Confirm representative routes load the previous deployment's local `/public` media.

If rebuilding instead of using the preserved deployment, remove `NEXT_PUBLIC_MEDIA_BASE_URL` from the affected Vercel environment first, then rebuild the last-known-good source.

`lib/media.ts` intentionally returns the original local path when the environment variable is absent. Local runtime assets must therefore remain in `public/` until production observation and the explicit cleanup gate are complete.

## Infrastructure rollback

The application can be rolled back independently of CloudFront. Do not delete the media stack during an incident. If the custom hostname is the fault boundary, remove only the `media` CNAME after the app has been redeployed with the media variable unset. The ACM validation CNAME can remain for certificate renewal.

## Pre-migration source point

- Git commit: `4892acdce7a217f921e4f6400f1bb16eeac9de20`
- Branch: `codex/sustainability-journal-editorial-assets`
- The working tree already contained inherited uncommitted editorial and asset work at migration start. It was preserved; no reset, checkout, clean, or destructive deletion was performed.
