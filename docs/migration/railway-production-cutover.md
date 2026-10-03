# Production cutover plan — NOT AUTHORIZED FOR EXECUTION

Production remains on Vercel. No domain, nameserver, record, certificate, AWS resource, or Production Firebase state was changed by this migration preparation.

## Verified rollback baseline (2026-10-03)

- Vercel project: `my-website`; deployment `dpl_6op6zGUeoFxSHzXEdV9qUCHtRXep`, READY, Production.
- Git SHA: `1ade619d39ad4c96770dceba2c1ca61193b9828b`.
- Canonical: `https://cothecoconutcompany.com`; www redirects to apex in application configuration.
- Apex and www: A `76.76.21.21`, TTL 600. Nameservers: `ns77.domaincontrol.com`, `ns78.domaincontrol.com`.
- Raw full GoDaddy zone export is held outside Git at `/Users/fazilshersha/.codex/qa/railway-runtime-migration-2026-10-03/godaddy-zone-original.txt`, SHA-256 `6e485de2f3dcddada722738d6ae6c9e9374fe1a850ac286daf07a2963754e8e6`.
- Redacted inventory: `railway-dns-inventory.json`, 29 records: SOA 1, A 2, CNAME 6, MX 5, NS 2, SRV 1, TXT 12. No AAAA/CAA present in the complete export. Refresh export immediately before any future change.

## Separate DNS hosting from registrar

Keep GoDaddy as registrar. Candidate DNS host: Cloudflare DNS, initially DNS-only (proxy off), with apex CNAME flattening. Railway requires the target returned by its custom-domain setup; never guess a stable Railway A address. GoDaddy's current apex limitation requires a compatible DNS host. Do not add either canonical custom domain during staging.

First migrate DNS hosting while apex/www STILL route to the existing Vercel service. Validate continuity, then schedule application-host cutover independently. Railway CDN stays off; do not introduce Cloudflare proxy caching simultaneously.

Before nameserver approval, prepare a complete before/after diff against the fresh raw export. Preserve every MX, SPF fragment, DKIM, DMARC, domain verification TXT, SRV, CloudFront media CNAME and ACM verification CNAME. Account for provider-managed SOA/NS changes explicitly rather than blindly importing old authority records. Check DNSSEC/DS status and coordinate signed delegation if enabled; do not create a broken chain of trust.

Email-specific inventory includes three Zoho MX records, two Mailgun/Customer.io MX records for `cioeu165103`, Zoho DKIM records, legacy secureserver records, root TXT verification/SPF records and subdomain SPF records. There are **two existing `_dmarc` TXT records**. Preserve evidence and obtain an email-owner decision before future DNS migration; do not silently merge or remove them. Conduct external inbound/outbound delivery checks before and after nameserver changes. Email continuity is a release gate.

## Approval gates and timeline

| Time | Required action after separate explicit approval |
| --- | --- |
| Before scheduling | Finish isolated staging security/auth/SEO/responsive/latency/cost evaluation. Approve exact candidate source. Resolve DNS/email diff and DNSSEC plan. |
| DNS hosting preparation | Import reviewed records into Cloudflare, leave web routing to Vercel, verify against Cloudflare authoritative servers before nameserver switch. Obtain explicit nameserver-change approval. |
| T-48h | Lower relevant TTLs where supported (apex/www already 600s). Complete DNS-host transition and verify email/media/web continuity; allow delegation caches to settle. |
| T-24h | Create a separate Railway Production environment only after approval; manually review Production resource and secret mapping. Build exact source with Production public config. Keep one Singapore replica. Verify candidate via generated URL, correct noindex handling during pre-cutover QA, health, cookies, auth, cache and rollback. Preview image cannot be relabeled Production. |
| T-1h | Freeze candidate SHA and config. Reverify live Vercel rollback and full DNS export. Add Railway apex/www domains only after approval, follow current verification/certificate instructions, and require valid certificates before broad traffic. Document any issuance dependency and do not promise zero downtime if it cannot be satisfied. |
| T0 | With explicit cutover approval, change ONLY apex/www web routing to exact Railway-provided targets using compatible flattening, DNS-only. Keep media/email/verification records unchanged. Application sends standards-correct www→apex redirect. |
| T+5m / 15m / 30m / 1h | Check several resolvers, authoritative answers, HTTPS certificate/SNI, apex/www, health/source, smoke, mobile routes, real user-led auth/session refresh/logout, same-origin protection, private cache and logs. Verify mail delivery and media. |
| T+24h | Recheck cost, errors, latency and email. Keep Vercel deployment, domains, secrets, and plan operational. |
| T+48/72h | Review soak evidence with the user. Vercel decommission requires separate explicit approval; it is not automatic. |

## DNS-first rollback

Trigger rollback for sustained web/auth errors, private caching, resource-isolation failures, material latency regression, broken media/email, or invalid TLS. Restore apex/www routing to the exact previously verified Vercel records at the active authoritative DNS provider. Preserve all unrelated records and leave Vercel canonical aliases attached. Verify multiple resolvers and HTTPS/auth/smoke after TTL propagation. If DNS hosting itself fails, use the separate delegation rollback and account for slower NS caches; do not confuse this with web-host rollback.

Session encryption keys must be planned during future Production review. New keys may require users to sign in again; never weaken cookie scope/security for seamless sessions. No migration of customer persistence is required because AWS/Firebase remain external.

## Retired destructive helper

`scripts/godaddy-dns-sync.ts --apply` now fails before network activity. Its old hard-coded Vercel A record must never overwrite a future Railway cutover. Read-only auditing remains available. The package command is retained to fail explicitly for old callers rather than unexpectedly writing.

References: https://docs.railway.com/networking/domains/working-with-domains and https://developers.cloudflare.com/dns/cname-flattening/.
