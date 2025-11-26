import { createI18n, detectLanguageClient } from '@/shared/i18n/config'
import { RouterClient } from '@tanstack/react-router/ssr/client'
import { hydrateRoot } from 'react-dom/client'
import { createRouter } from './router'

const language = detectLanguageClient()
const i18nInstance = await createI18n(language)

const router = createRouter(i18nInstance)

hydrateRoot(document, <RouterClient router={router} />)
