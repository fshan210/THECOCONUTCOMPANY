# Incident Response

## Severity triggers

- Authentication bypass.
- Token/cookie/secret exposure.
- Unauthorized access to another user’s data.
- Payment/order integrity issue.
- Credential compromise.
- Unusual API error/throttle spike.

## First 15 minutes

1. Preserve evidence: request IDs, CloudWatch time range, commit/deployment ID.
2. Stop harm: disable affected API route or set Lambda reserved concurrency to zero if needed.
3. Revoke compromised sessions/users.
4. Rotate exposed secrets.
5. Notify stakeholders with facts only.

## Investigation

- Use request IDs.
- Review audit/security events.
- Check CloudWatch alarms.
- Confirm whether personal data was exposed.
- Do not paste secrets into chat, tickets, or logs.

## Recovery

- Patch root cause.
- Add a regression test.
- Redeploy dev, then production after review.
- Restore data from DynamoDB PITR only to a new table first.

## Post-incident

- Write timeline.
- List customer impact.
- Record containment and prevention actions.
- Update this runbook.

## Production authentication containment

If a Production sign-up, session, CORS or data-ownership issue occurs during
cutover:

1. Remove `COGNITO_APP_CLIENT_ID` and `SERVER_API_BASE_URL` from the Vercel
   Production scope or promote the pre-cutover Vercel deployment. This returns
   customer auth to the existing fail-closed state without deleting data.
2. Disable the affected Cognito user or revoke refresh tokens when an account
   is involved; never inspect or copy tokens from logs.
3. Use API Gateway and Lambda request IDs to isolate the failure. Escalate
   cross-user access, session leakage, or DEV/Production cross-connection as a
   critical incident and halt public authentication immediately.
4. Restore DynamoDB only to a new table from PITR after evidence review; never
   overwrite the live protected table during the first response.
