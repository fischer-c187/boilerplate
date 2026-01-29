# Feature: Auth

## But

Authentification avec Better Auth (email + password) et verification email.

## Ou ca vit

- Serveur : `src/server/adaptaters/auth/auth.ts`
- Route API : `src/server/api/auth.ts` (expose `/api/auth/*`)
- Client front : `src/shared/api-client/auth/auth.api.ts`

## Configuration minimale

Variables serveur (voir `src/server/config/env.ts`) :

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `MAIL_PROVIDER` (optionnel en dev, requis en prod)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM` (si SMTP)
- `RESEND_API_KEY` (si Resend)

## Utilisation (front)

- Importer `authClient` : `src/shared/api-client/auth/auth.api.ts`
- Exemples d'usage :
  - Login : `authClient.signIn.email({ email, password })`
  - Signup : `authClient.signUp.email({ email, password, name })`
  - Verification : `authClient.sendVerificationEmail({ email, callbackURL })`

Les formulaires existants :

- `src/front/components/form/LoginForm.tsx`
- `src/front/components/form/SignupForm.tsx`

## Notes

- La verification email est active (voir `emailVerification` dans `auth.ts`).
- L'envoi passe par `src/server/services/auth/email-verification.ts`.
