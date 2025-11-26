export default {
  // Login
  login: {
    title: 'Connexion',
    subtitle: 'Connectez-vous à votre compte',
    emailPlaceholder: 'Entrez votre email',
    passwordPlaceholder: 'Entrez votre mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    noAccount: "Vous n'avez pas de compte ?",
    signUp: "S'inscrire",
    submit: 'Se connecter',
  },

  // Register
  register: {
    title: 'Inscription',
    subtitle: 'Créez votre compte',
    namePlaceholder: 'Entrez votre nom',
    emailPlaceholder: 'Entrez votre email',
    passwordPlaceholder: 'Choisissez un mot de passe',
    confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
    hasAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    submit: "S'inscrire",
  },

  // Messages
  message: {
    loginSuccess: 'Connexion réussie',
    loginError: 'Identifiants incorrects',
    registerSuccess: 'Inscription réussie',
    registerError: "Erreur lors de l'inscription",
    logoutSuccess: 'Déconnexion réussie',
  },
} as const
