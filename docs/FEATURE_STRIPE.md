# Feature: Stripe

## But

Abonnements Stripe (checkout, portal, webhooks) avec persistance en base.

## Ou ca vit

- API : `src/server/api/stripe.ts`
- Services : `src/server/services/stripe/*`
- Schema DB : `src/server/adaptaters/db/schema/stripe-schema.ts`

## Endpoints principaux

- `GET /api/stripe/plans`
- `POST /api/stripe/checkout/subscription` (auth requis)
- `POST /api/stripe/portal` (auth requis)
- `GET /api/stripe/subscription` (auth requis)
- `GET /api/stripe/invoices` (auth requis)
- `POST /api/stripe/webhook` (signature Stripe requise)

## Configuration minimale

Variables serveur (voir `src/server/config/env.ts`) :

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_API_VERSION`

## Utilisation (front)

Le client Hono est expose via `src/shared/api-client/client.ts` :

- Plans : `client.stripe.plans.$get()`
- Checkout : `client.stripe.checkout.subscription.$post({ json: { priceId } })`
- Portal : `client.stripe.portal.$post()`

Exemple concret : `src/front/features/dashboard/components/StripeTestCard.tsx`.

## Webhook local

- Listener : `pnpm stripe:listen`
- Trigger de test : `pnpm stripe:trigger`

Le webhook attend l'en-tete `stripe-signature`.
