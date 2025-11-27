// French translations
import commonFr from './fr/common'
import authFr from './fr/auth'
import validationFr from './fr/validation'

// English translations
import commonEn from './en/common'
import authEn from './en/auth'
import validationEn from './en/validation'

export const resources = {
  fr: {
    common: commonFr,
    auth: authFr,
    validation: validationFr,
  },
  en: {
    common: commonEn,
    auth: authEn,
    validation: validationEn,
  },
} as const
