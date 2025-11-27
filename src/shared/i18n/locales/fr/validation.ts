export default {
  // Field errors
  field: {
    required: 'Ce champ est requis',
    invalid: 'Ce champ est invalide',
    tooShort: 'Ce champ est trop court',
    tooLong: 'Ce champ est trop long',
  },

  // Email errors
  email: {
    required: "L'email est requis",
    invalid: "L'email est invalide",
    alreadyExists: 'Cet email existe déjà',
  },

  // Password errors
  password: {
    required: 'Le mot de passe est requis',
    tooShort: 'Le mot de passe doit contenir au moins {{min}} caractères',
    tooWeak: 'Le mot de passe est trop faible',
    mismatch: 'Les mots de passe ne correspondent pas',
  },

  // Name errors
  name: {
    required: 'Le nom est requis',
    tooShort: 'Le nom doit contenir au moins {{min}} caractères',
    tooLong: 'Le nom doit contenir au maximum {{max}} caractères',
  },
} as const
