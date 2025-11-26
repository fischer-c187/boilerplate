import {
  SUPPORTED_LANGUAGES,
  setLanguagePreference,
  type SupportedLanguage,
} from '@/shared/i18n/config'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (lang: SupportedLanguage) => {
    void i18n.changeLanguage(lang)
    setLanguagePreference(lang)
  }

  return (
    <div className="flex gap-2">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleLanguageChange(lang)}
          className={`px-3 py-1 rounded transition-colors ${
            i18n.language === lang
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-label={`Switch to ${lang.toUpperCase()}`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
