import { clientEnv } from '@/front/config/env.client'

export interface SeoConfig {
  title?: string
  description?: string
  image?: string
  url?: string
  indexable?: boolean
}

interface MetaTag {
  title?: string
  name?: string
  property?: string
  content?: string
  charSet?: string
}

/**
 * Builds SEO meta tags for TanStack Router head() function.
 * Uses env defaults with optional per-page overrides.
 */
export function buildSeoMeta(config?: SeoConfig): MetaTag[] {
  if (!clientEnv.VITE_SEO_ENABLED) {
    return [
      { charSet: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    ]
  }

  const {
    title: pageTitle,
    description: pageDescription,
    image: pageImage,
    url: pageUrl,
    indexable = true,
  } = config ?? {}

  const siteName = clientEnv.VITE_SITE_NAME
  const siteDescription = clientEnv.VITE_SITE_DESCRIPTION
  const siteUrl = clientEnv.VITE_SITE_URL
  const ogImage = pageImage ?? clientEnv.VITE_OG_IMAGE
  const twitterHandle = clientEnv.VITE_TWITTER_HANDLE

  // Title: "pageTitle | siteName" or just "siteName"
  const title = pageTitle ? `${pageTitle} | ${siteName}` : siteName
  const description = pageDescription ?? siteDescription
  const canonicalUrl = pageUrl ? `${siteUrl}${pageUrl}` : siteUrl
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`

  const meta: MetaTag[] = [
    { charSet: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { title },
    { name: 'description', content: description },

    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: imageUrl },
    { property: 'og:site_name', content: siteName },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]

  // Twitter handle (optional)
  if (twitterHandle) {
    meta.push({ name: 'twitter:site', content: twitterHandle })
    meta.push({ name: 'twitter:creator', content: twitterHandle })
  }

  // Robots noindex for private pages
  if (!indexable) {
    meta.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  return meta
}
