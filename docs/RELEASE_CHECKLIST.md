# .CO release checklist

## Before merge

- [ ] Change fixes a verified defect, security/accessibility/performance issue, or operational safeguard.
- [ ] Approved visuals, packaging, media mapping, and motion character remain unchanged unless explicitly approved.
- [ ] Working tree contains only the intended change.
- [ ] `npm ci` and all workspace `npm ci --prefix ...` installs succeed.
- [ ] `npm run typecheck`
- [ ] `npm run backend:typecheck`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Local production server passes `BASE_URL=http://127.0.0.1:3000 npm run smoke:production`.
- [ ] Affected desktop and mobile paths are checked.
- [ ] Keyboard/focus and reduced-motion paths are checked.
- [ ] No first-party console, hydration, image, video, or network failures.
- [ ] Environment variable names/scopes are reviewed without printing values.
- [ ] No source master, cache, screenshot, secret, or local `.env` file is staged.

## After merge/deploy

- [ ] GitHub `validate` check passed for the exact commit.
- [ ] Vercel deployment is `Ready` and built from the expected `main` commit.
- [ ] `npm run smoke:production` passes against `https://cothecoconutcompany.com`.
- [ ] Canonical domain and `www` to apex HTTPS redirect are correct.
- [ ] Representative product image, scraping video, farm video, and CloudFront object return successfully.
- [ ] No production console/network error on the affected path.
- [ ] Deployment ID and rollback target are recorded for material releases.
