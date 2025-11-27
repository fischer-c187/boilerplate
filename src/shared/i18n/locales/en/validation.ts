export default {
  // Field errors
  field: {
    required: 'This field is required',
    invalid: 'This field is invalid',
    tooShort: 'This field is too short',
    tooLong: 'This field is too long',
  },

  // Email errors
  email: {
    required: 'Email is required',
    invalid: 'Email is invalid',
    alreadyExists: 'This email already exists',
  },

  // Password errors
  password: {
    required: 'Password is required',
    tooShort: 'Password must be at least {{min}} characters',
    tooWeak: 'Password is too weak',
    mismatch: 'Passwords do not match',
  },

  // Name errors
  name: {
    required: 'Name is required',
    tooShort: 'Name must be at least {{min}} characters',
    tooLong: 'Name must be at most {{max}} characters',
  },
} as const
