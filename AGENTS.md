# Repository Guidelines

## Project Structure & Module Organization

- `src/index.ts` hosts the Hono server bootstrap; add new routes in nearby modules and import them here.
- Build output lives in `dist/` after `pnpm build`; keep compiled files out of version control.
- Root configs (`package.json`, `tsconfig.json`, lockfile) define dependencies and compiler targets—update them together when bumping toolchains.

## Build, Test, and Development Commands

- `pnpm install` restores exact dependencies (uses pnpm-lock.yaml).
- `pnpm dev` launches `tsx` with hot reload on http://localhost:3000.
- `pnpm build` runs `tsc` to emit ESM JavaScript into `dist/`.
- `pnpm start` executes the compiled server; use it to verify production output.

## Coding Style & Naming Conventions

- Stick to ESM imports/exports in TypeScript with 2-space indentation.
- Use `camelCase` for variables/functions, `PascalCase` for exported types, and `UPPER_SNAKE_CASE` for environment keys.
- Order imports: external packages, then relative modules; keep route handlers pure and return responses directly.
- Run `pnpm build` before submitting to ensure type safety and catch missing exports.

## Testing Guidelines

- A formal test runner is not yet configured; prefer Vitest in `src/__tests__/` when adding coverage.
- Name specs `<feature>.test.ts` and mirror the source tree for easy discovery.
- Focus on HTTP behavior—status codes, headers, and payload shape—while mocking integrations.
- Until `pnpm test` exists, treat `pnpm build` as the pre-merge minimum.

## Commit & Pull Request Guidelines

- Follow Conventional Commits (`feat:`, `fix:`, `chore:`) so history remains machine-readable.
- Keep each commit focused; include a body describing context or follow-up steps if behavior changes.
- PRs should state intent, list manual verification commands, and link issues or tickets.
- Include screenshots or cURL snippets when responses change to demonstrate expected results.

## Security & Configuration Tips

- Keep secrets in `.env`; rely on a process manager to inject them at runtime.
- Make the port configurable through `process.env.PORT` before deployment.
- Review dependency updates deliberately and document security fixes in commit messages.

## 🧠 Agent: Project

### Rôle

Responsable du suivi projet et de la communication avec Linear.

### Fonction

Utilise le **MCP Linear** pour récupérer les informations du projet, du milestone courant et des features associées, puis met à jour le fichier `LINEAR.md`.

---

## 🔄 Sync LINEAR.md depuis Linear (via MCP)

### But

Mettre à jour `LINEAR.md` à partir des données Linear, en récupérant le **milestone actif** et les **features associées**, puis en listant les **prochaines tâches** à exécuter.

### Déclencheur

Lorsque la consigne contient des instructions telles que :

- “sync linear”
- “maj linear”
- “update LINEAR.md”
- “synchroniser Linear”

### Source

- MCP: `linear`
- Endpoint: `https://mcp.linear.app/mcp`

### Étapes

1. Récupérer l’équipe/projet courant.
2. Identifier le **milestone actif** (`isActive == true` ou `isCurrent == true`).
3. Récupérer les **features** rattachées à ce milestone.
4. Récupérer les **issues** associées à ces features.
5. Filtrer les issues ouvertes (`state` ∉ {Done, Canceled}).
6. Trier les issues par :
   - `priority` décroissante
   - puis `position` croissante
   - puis `createdAt` croissante
7. Conserver les **10 prochaines tâches** par défaut.

### Format de sortie (`LINEAR.md`)

Projet: {project.name}
Milestone: {cycle.name} ({cycle.startDate} → {cycle.endDate})
Features

{pour chaque feature du milestone}

[ ] {feature.name}

Prochaines tâches

{pour chaque issue ouverte triée}

## Règles

- Écrire ou remplacer complètement `LINEAR.md` à la racine.
- Ne jamais inclure d’ID internes, d’URL, ou d’historique Linear.
- ajouter les taches finit dans une section journal en bas du fichier avec : date - milestone - les feautres terminer
- Si aucun milestone actif n’est trouvé :
  - Écrire `## Milestone: AUCUN (aucun cycle actif)` et laisser le reste vide.
- Si une feature n’a aucune issue ouverte :
  - Lister la feature dans `## Features`, mais rien dans `## Prochaines tâches`.

### Exemple de commande

> “Synchronise LINEAR.md depuis Linear.”

→ L’agent Project appelle le MCP Linear, récupère les données, génère `LINEAR.md`, et remplace le fichier.

---
