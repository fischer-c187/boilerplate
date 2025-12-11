import { env } from '@/server/config/env'
import Stripe from 'stripe'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY)

type Subscription = {
  name: string
  description: string
  price: number
  interval: Stripe.Price.Recurring.Interval
  trial_period_days?: number
}

const subscriptions: Subscription[] = [
  {
    name: 'Free',
    description: 'Free subscription',
    price: 0,
    interval: 'month',
    trial_period_days: 0,
  },
  {
    name: 'Pro annual',
    description: 'Pro subscription annual',
    price: 100,
    interval: 'year',
    trial_period_days: 0,
  },
  {
    name: 'Pro monthly',
    description: 'Pro subscription monthly',
    price: 10,
    interval: 'month',
    trial_period_days: 0,
  },
]

const createSubscriptions = async () => {
  const products = await stripe.products.list({ active: true })
  const createdPrices: Array<{ name: string; priceId: string }> = []

  for (const subscription of subscriptions) {
    // Skip free subscription (not needed in Stripe)
    if (subscription.price === 0) {
      console.log(`⊘ Skipping "${subscription.name}" (free plan, not needed in Stripe)`)
      continue
    }

    // Check if product already exists
    const existingProduct = products.data.find((product) => product.name === subscription.name)

    if (existingProduct) {
      console.log(`✓ Product "${subscription.name}" already exists (${existingProduct.id})`)
      continue
    }

    // Create product and price
    try {
      const stripeProduct = await stripe.products.create({
        name: subscription.name,
        description: subscription.description,
      })

      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: subscription.price * 100,
        currency: 'eur',
        recurring: {
          interval: subscription.interval,
          trial_period_days: subscription.trial_period_days,
        },
      })

      createdPrices.push({
        name: subscription.name,
        priceId: price.id,
      })

      console.log(`✅ Created "${subscription.name}"`)
      console.log(`   Product ID: ${stripeProduct.id}`)
      console.log(`   Price ID: ${price.id}`)
    } catch (error) {
      console.error(`❌ Error creating "${subscription.name}":`, error)
    }
  }

  // Display summary
  if (createdPrices.length > 0) {
    console.log('\n🎉 Setup complete!\n')
    console.log('📋 Add these to your .env file:\n')
    createdPrices.forEach(({ name, priceId }) => {
      const envKey = `STRIPE_PRICE_ID_${name.toUpperCase().replace(/ /g, '_')}`
      console.log(`${envKey}=${priceId}`)
    })
  } else {
    console.log('\n✓ All products already exist!')
  }
}

void createSubscriptions()
