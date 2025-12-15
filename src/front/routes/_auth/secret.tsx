import { client } from '@/shared/api-client/client'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import type { User } from 'better-auth'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_auth/secret')({
  component: SecretPage,
  ssr: false,
})

function SecretPage() {
  const { t } = useTranslation('common')
  const { session } = useRouteContext({ from: '/_auth' })
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const user = session?.user as User | null

  const handleCreateCheckoutSession = async () => {
    setLoading(true)
    const priceId = 'price_1Sd8W5BS3Vjd9zTqCtmpepnj'
    try {
      const res = await client.stripe.checkout.subscription.$post({
        json: {
          priceId,
        },
      })
      if (!res.ok) {
        throw new Error('Failed to create checkout session')
      }
      const data = (await res.json()) as { url: string }
      setCheckoutUrl(data.url)
    } catch (error: unknown) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async () => {
    setLoading(true)
    try {
      const res = await client.mail.test.$get()
      if (!res.ok) {
        throw new Error('Failed to send email')
      }
      const data = (await res.json()) as { message: string }
      console.log(data)
      setEmailSent(true)
    } catch (error: unknown) {
      console.error('Error sending email:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show secret content for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔒 {t('nav.profile')}</h1>
          <p className="text-gray-600">{t('message.loading')}</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            {t('nav.home')}, {user?.name || user?.email}!
          </h2>
          <p className="text-blue-800">{t('message.success')}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">User Information</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-medium">{t('form.email')}:</span> {user?.email}
              </li>
              {user?.name && (
                <li>
                  <span className="font-medium">{t('form.name')}:</span> {user.name}
                </li>
              )}
              <li>
                <span className="font-medium">User ID:</span> {user?.id}
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">🎉 Exclusive Content</h3>
            <p className="text-green-800 text-sm">
              This is secret information that only logged-in users can access. You could put premium
              features, private data, or protected resources here.
            </p>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <button
            disabled={loading}
            onClick={() => void handleSendEmail()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {emailSent ? 'Email Sent' : t('button.submit')}
          </button>
          <button
            disabled={loading}
            onClick={() => void handleCreateCheckoutSession()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Create Checkout Session
          </button>
          {checkoutUrl && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                Checkout Session URL
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
