import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './locales'

// Supported languages
export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'fr'

// i18next configuration
const i18nConfig = {
  resources,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  defaultNS: 'common',
  ns: ['common', 'auth', 'validation'],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
}

/**
 * Creates and initializes an i18n instance for SSR
 */
export async function createI18n(language: SupportedLanguage) {
  const instance = i18n.createInstance()

  await instance.use(initReactI18next).init({
    ...i18nConfig,
    lng: language,
  })

  return instance
}

/**
 * Detect language from HTTP request (SSR)
 * Priority: Cookie > Accept-Language > Default
 */
export function detectLanguage(request: Request): SupportedLanguage {
  // 1. Check cookie
  const cookie = request.headers.get('cookie')?.match(/language=(\w+)/)?.[1]
  if (cookie && SUPPORTED_LANGUAGES.includes(cookie as SupportedLanguage)) {
    return cookie as SupportedLanguage
  }

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0]
  if (acceptLang && SUPPORTED_LANGUAGES.includes(acceptLang as SupportedLanguage)) {
    return acceptLang as SupportedLanguage
  }

  return DEFAULT_LANGUAGE
}

/**
 * Detect language on client side
 * Priority: localStorage > cookie > navigator > Default
 */
export function detectLanguageClient(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  // 1. localStorage
  const stored = localStorage.getItem('language')
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage
  }

  // 2. Cookie
  const cookie = document.cookie.match(/language=(\w+)/)?.[1]
  if (cookie && SUPPORTED_LANGUAGES.includes(cookie as SupportedLanguage)) {
    return cookie as SupportedLanguage
  }

  // 3. Navigator
  const browserLang = navigator.language.split('-')[0]
  if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage
  }

  return DEFAULT_LANGUAGE
}

/**
 * Save language preference (client only)
 */
export function setLanguagePreference(language: SupportedLanguage): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('language', language)
  document.cookie = `language=${language}; path=/; max-age=31536000; samesite=lax`
}
