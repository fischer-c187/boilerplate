import db from '@/server/adaptaters/db/postgres'
import { plans } from '@/server/adaptaters/db/schema/stripe-schema'
import { env } from '@/server/config/env'
import { eq } from 'drizzle-orm'
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
    const planId = subscription.name.toLowerCase().replace(/ /g, '-')

    // Handle free plan (DB only, not in Stripe)
    if (subscription.price === 0) {
      // Check if plan exists in DB
      const [existingPlan] = await db.select().from(plans).where(eq(plans.id, planId)).limit(1)

      if (existingPlan) {
        console.log(`✓ Free plan "${subscription.name}" already exists in DB`)
      } else {
        // Insert free plan into DB
        await db.insert(plans).values({
          id: planId,
          name: subscription.name,
          description: subscription.description,
          price: subscription.price * 100,
          currency: 'eur',
          interval: subscription.interval,
          isActive: true,
          sortOrder: 0,
        })
        console.log(`✅ Created free plan "${subscription.name}" in DB`)
      }
      continue
    }

    // Check if product already exists in Stripe
    const existingProduct = products.data.find((product) => product.name === subscription.name)

    if (existingProduct) {
      console.log(
        `✓ Product "${subscription.name}" already exists in Stripe (${existingProduct.id})`
      )

      // Get the price ID for this product
      const prices = await stripe.prices.list({
        product: existingProduct.id,
        active: true,
        limit: 1,
      })

      if (prices.data.length > 0) {
        const priceId = prices.data[0].id
        const productId = existingProduct.id

        // Check if plan exists in DB
        const [existingPlan] = await db
          .select()
          .from(plans)
          .where(eq(plans.stripePriceId, priceId))
          .limit(1)

        if (!existingPlan) {
          // Insert plan into DB
          await db.insert(plans).values({
            id: planId,
            name: subscription.name,
            description: subscription.description,
            stripePriceId: priceId,
            stripeProductId: productId,
            price: subscription.price * 100,
            currency: 'eur',
            interval: subscription.interval,
            isActive: true,
            sortOrder: subscription.name.includes('monthly') ? 1 : 2,
          })
          console.log(`✅ Added "${subscription.name}" to DB with Price ID: ${priceId}`)
        } else {
          console.log(`✓ Plan "${subscription.name}" already exists in DB`)
        }
      }
      continue
    }

    // Create product and price in Stripe
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

      // Insert plan into DB
      await db.insert(plans).values({
        id: planId,
        name: subscription.name,
        description: subscription.description,
        stripePriceId: price.id,
        stripeProductId: stripeProduct.id,
        price: subscription.price * 100,
        currency: 'eur',
        interval: subscription.interval,
        isActive: true,
        sortOrder: subscription.name.includes('monthly') ? 1 : 2,
      })

      createdPrices.push({
        name: subscription.name,
        priceId: price.id,
      })

      console.log(`✅ Created "${subscription.name}"`)
      console.log(`   Product ID: ${stripeProduct.id}`)
      console.log(`   Price ID: ${price.id}`)
      console.log(`   Added to DB with ID: ${planId}`)
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

createSubscriptions()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
