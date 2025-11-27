// src/shared/i18n/i18next.d.ts
import type { resources } from './locales'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: (typeof resources)['fr']
  }
}

export type Namespace = keyof (typeof resources)['fr']
