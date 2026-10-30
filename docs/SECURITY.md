# Security baseline

## Required before accounts launch
- Use a maintained authentication library; do not invent password/session cryptography.
- Hash passwords with a modern password hashing algorithm through the selected auth provider.
- Use secure, HttpOnly, SameSite cookies; rotate sessions after authentication and privilege changes.
- Enforce authorization on the server for every protected read and write.
- Add email/phone verification, account recovery safeguards and login rate limits.
- Validate and normalize user input; escape output and protect against CSRF, XSS, SSRF and injection.
- Store secrets only in deployment secret settings. Rotate any credential that is ever exposed.
- Add audit events for privileged actions and account/security changes.
- Minimize personal data; define retention, export and deletion workflows.
- Add dependency scanning, secret scanning, security headers and backup-restore drills.

## High-risk modules
- **Messaging encryption**: do not market chats as end-to-end encrypted until protocol design, key lifecycle, multi-device behavior, metadata exposure and independent review are complete.
- **Payments/wallet**: use regulated payment partners; maintain a reconciled ledger. Do not custody funds or represent a stored-value wallet as live without required legal and regulatory approvals.
- **Calls/live video**: use a dedicated WebRTC/SFU architecture with abuse controls, TURN capacity and privacy review.
- **AI**: disclose AI use, obtain consent where needed, protect private content from training/retrieval leakage and provide reporting controls.

## Incident readiness
Define severity levels, security contact, incident runbooks, key rotation, user notification criteria, backup restoration and post-incident review before public scale.


## Phase 2 deployment gate
The initial email/password flow is a foundation, not yet ready for an unrestricted public launch. Before enabling public registration:
- Put the app behind Redis-backed IP + account rate limits for register/login and add bot protection.
- Add email verification and secure password recovery with one-time, hashed, expiring tokens.
- Configure a managed PostgreSQL database, TLS-only connection string, backups and restore test.
- Configure HTTPS and verify secure cookie behavior on the production domain.
- Add automated auth tests, dependency/secret scanning and an independent security review.
- Create the first administrator only through the documented one-time seed process. Never expose role selection in public registration.
