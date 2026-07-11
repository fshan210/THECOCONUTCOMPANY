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
