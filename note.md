1. Sécurité API : cookie ≠ preuve d’authentification

- La présence d’un cookie sur /api/secret ne suffit jamais comme critère de sécurité.
  - Il peut être expiré, forgé, ou associé à une session révoquée.
  - Si tu fais juste if (req.headers.get('cookie')), tu bypasses toute la sécurité de
    Better Auth.
- Le bon modèle mental :
  - Front
    - credentials: 'include' côté authClient (ou équivalent dans createAuthClient)
      garantit que le cookie de session est bien envoyé vers ton backend (dont /api/
      secret).
    - Le front ne décide pas si l’utilisateur est authentifié pour une API sensible, il
      se contente d’appeler l’endpoint.
  - Back (Hono)
    - Tu laisses Better Auth lire les cookies de la requête et valider la session.
    - Tu exposes ça via un middleware requireAuth :
      - lit la requête (c.req.raw), demande à Better Auth la session,
      - si aucune session valide → 401,
      - sinon → c.set('user', session.user) et next().
- À retenir :
  - Le cookie est un support technique.
  - La preuve fonctionnelle “cet utilisateur est connecté” = “Better Auth m’a renvoyé une
    session valide pour cette requête”.

———

2. SSR sur /\_auth sans redirection intempestive au refresh

Ton problème actuel :

- Avec ssr: true sur /\_auth, quand tu rafraîchis /\_auth/secret :
  - Le premier rendu est un SSR via entry-server.tsx.
  - Si ton beforeLoad appelle authClient.getSession() (pensé pour le navigateur), côté
    serveur il ne récupère pas la session (pas le bon environnement / pas de fetch
    configuré comme il faut), donc il croit que tu n’es pas logué → redirection vers /
    login dès le SSR.

Deux approches possibles :

A. Approche simple (celle que tu as déjà)

- Laisser ssr: false sur /\_auth (et idéalement sur toute la branche \_auth).
- Conséquences :
  - Les pages protégées ne sont pas SSR, mais
  - au refresh, le check d’auth se fait uniquement côté client, avec
    authClient.getSession() et les cookies réels du navigateur → pas de redirection
    injustifiée si la session existe.

C’est simple, sûr, et suffisant tant que tu n’as pas besoin d’un vrai SSR sur ces pages.

B. Approche avancée : vrai SSR + session côté serveur

Objectif : que le SSR voie déjà l’utilisateur comme connecté et n’envoie pas une redirection
à /login si la session est valide.

Principe architecturale :

1. Résoudre la session dans Hono avant TanStack Router
   - Dans entry-server.tsx, dans ton app.use('\*', ...) :
     - tu lis la session via Better Auth à partir de c.req.raw (cookies),
     - tu obtiens une session (ou null),
     - tu passes cette session dans le RouterContext de TanStack Router (createRouter).
2. Utiliser cette session côté routes SSR
   - Dans /\_auth/route.tsx :
     - beforeLoad doit distinguer serveur vs client :
       - Serveur : ne pas appeler authClient, mais utiliser ctx.context.session
         (injectée par Hono).
       - Client : utiliser authClient.getSession() pour rafraîchir/valider après
         hydratation.
     - Si session?.user existe → OK, tu retournes { session }.
     - Sinon → redirect('/login', { redirectTo: ... }).
3. Garder la cohérence entre SSR et hydratation
   - Le HTML SSR est généré avec un user déjà connu.
   - À l’hydratation, le client retrouve la même info (soit via le contexte, soit via un
     getSession qui renvoie la même session), donc pas de “flash” de redirection.

À retenir :

- Pour avoir ssr: true sur /\_auth sans problème au refresh, il faut que l’auth soit résolue
  au niveau du serveur Hono et passée à TanStack Router, plutôt que de demander au client
  Better Auth (orienté navigateur) de deviner la session côté Node.
- Si tu ne veux pas rentrer tout de suite dans cette complexité, garder la zone \_auth non-
  SSR (ssr: false) est un compromis très raisonnable.
