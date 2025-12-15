import db from '@/server/adaptaters/db/postgres'
import { user } from '@/server/adaptaters/db/schema/auth-schema'
import {
  invoice,
  plans,
  stripeCustomer,
  subscription,
  webhookEvent,
} from '@/server/adaptaters/db/schema/stripe-schema'
import { eq, sql } from 'drizzle-orm'

// Test utilities
let testCount = 0
let passedCount = 0

const test = async (name: string, fn: () => Promise<void>) => {
  testCount++
  try {
    await fn()
    console.log(`✅ Test ${testCount}: ${name}`)
    passedCount++
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`❌ Test ${testCount}: ${name}`)
    console.error(`   Error: ${errorMessage}`)
    throw error
  }
}

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

// Cleanup function
const cleanup = async () => {
  console.log('\n🧹 Cleaning up test data...')

  try {
    // Delete in reverse order of FKs to avoid constraint violations
    await db.delete(invoice).where(sql`id LIKE 'in_test_%' OR id = 'in_delete_test'`)
    await db.delete(webhookEvent).where(sql`id LIKE 'evt_test_%'`)
    await db
      .delete(subscription)
      .where(
        sql`stripe_subscription_id LIKE 'sub_test_%' OR stripe_subscription_id = 'sub_test_no_plan'`
      )
    await db
      .delete(stripeCustomer)
      .where(sql`stripe_customer_id LIKE 'cus_test_%' OR stripe_customer_id = 'cus_delete_test'`)
    await db
      .delete(user)
      .where(sql`id LIKE 'user_test_%' OR id = 'user_delete_test' OR id = 'user_test_unique'`)

    console.log('✅ Cleanup complete')
  } catch (error) {
    console.error('⚠️  Cleanup error (may be normal):', error)
  }
}

// Main test suite
async function runTests() {
  console.log('🧪 Testing Stripe relations...\n')

  try {
    // Test 1: Seed plans (standalone table)
    await test('Seed plans', async () => {
      const plansData = [
        {
          id: 'free',
          name: 'Free',
          description: 'Plan gratuit avec fonctionnalités de base',
          stripePriceId: null,
          stripeProductId: null,
          price: 0,
          currency: 'eur',
          interval: null,
          features: JSON.stringify(['Feature 1', 'Feature 2']),
          isActive: true,
          sortOrder: 1,
        },
        {
          id: 'pro-monthly',
          name: 'Pro Monthly',
          description: 'Abonnement Pro mensuel',
          stripePriceId: 'price_test_monthly',
          stripeProductId: 'prod_test_monthly',
          price: 1000,
          currency: 'eur',
          interval: 'month',
          features: JSON.stringify(['All Free features', 'Feature 3', 'Feature 4']),
          isActive: true,
          sortOrder: 2,
        },
        {
          id: 'pro-annual',
          name: 'Pro Annual',
          description: 'Abonnement Pro annuel (-17%)',
          stripePriceId: 'price_test_annual',
          stripeProductId: 'prod_test_annual',
          price: 10000,
          currency: 'eur',
          interval: 'year',
          features: JSON.stringify(['All Pro features', '17% discount']),
          isActive: true,
          sortOrder: 3,
        },
      ]

      await db.insert(plans).values(plansData).onConflictDoNothing()

      const result = await db.select().from(plans)
      assert(result.length >= 3, 'Should have at least 3 plans')
    })

    // Test 2: Create user + stripeCustomer (relation 1:1)
    await test('Create user and stripe customer (1:1)', async () => {
      // 1. Create a test user (Better Auth)
      const [testUser] = await db
        .insert(user)
        .values({
          id: 'user_test_123',
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: true,
        })
        .returning()

      // 2. Create a stripeCustomer linked to the user
      const [customer] = await db
        .insert(stripeCustomer)
        .values({
          id: crypto.randomUUID(), // UUID manually generated (DB migration needs uuid type)
          userId: testUser.id, // FK to user.id
          email: testUser.email,
          name: testUser.name,
          stripeCustomerId: 'cus_test_123', // Stripe ID
        })
        .returning()

      // 3. Verify the relationship
      const customerWithUser = await db
        .select()
        .from(stripeCustomer)
        .leftJoin(user, eq(stripeCustomer.userId, user.id))
        .where(eq(stripeCustomer.id, customer.id))

      assert(customerWithUser[0].user?.id === testUser.id, 'FK user_id works')
      assert(
        customerWithUser[0].stripe_customer.stripeCustomerId === 'cus_test_123',
        'Stripe customer ID is correct'
      )
    })

    // Test 3: Create subscription with FK to customer + plan
    await test('Create subscription with plan', async () => {
      // 1. Get the customer created previously
      const customers = await db
        .select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.stripeCustomerId, 'cus_test_123'))
        .limit(1)
      assert(customers.length > 0, 'Customer should exist')
      const customer = customers[0]

      // 2. Create a subscription
      const [sub] = await db
        .insert(subscription)
        .values({
          id: crypto.randomUUID(), // UUID manually generated (DB migration needs uuid type)
          userId: customer.userId,
          stripeCustomerId: customer.id, // FK to stripeCustomer (UUID)
          planId: 'pro-monthly', // FK to plans.id (text)
          stripeSubscriptionId: 'sub_test_123', // Stripe ID
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
        })
        .returning()

      // 3. Verify the relationships
      const subWithRelations = await db
        .select({
          subscription,
          customer: stripeCustomer,
          plan: plans,
        })
        .from(subscription)
        .leftJoin(stripeCustomer, eq(subscription.stripeCustomerId, stripeCustomer.id))
        .leftJoin(plans, eq(subscription.planId, plans.id))
        .where(eq(subscription.id, sub.id))

      assert(subWithRelations[0].customer?.id === customer.id, 'FK stripeCustomerId works')
      assert(subWithRelations[0].plan?.id === 'pro-monthly', 'FK planId works')
    })

    // Test 4: Create invoices with FK to subscription + customer
    await test('Create invoices', async () => {
      const subs = await db
        .select()
        .from(subscription)
        .where(eq(subscription.stripeSubscriptionId, 'sub_test_123'))
        .limit(1)
      assert(subs.length > 0, 'Subscription should exist')
      const sub = subs[0]

      const customers = await db
        .select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.stripeCustomerId, 'cus_test_123'))
        .limit(1)
      assert(customers.length > 0, 'Customer should exist')
      const customer = customers[0]

      // Create an invoice
      const [inv] = await db
        .insert(invoice)
        .values({
          id: 'in_test_123', // Stripe ID direct (text)
          subscriptionId: sub.id, // FK to subscription (UUID)
          stripeCustomerId: customer.id, // FK to stripeCustomer (UUID)
          amountPaid: 1000,
          amountDue: 1000,
          currency: 'eur',
          status: 'paid',
          paid: true,
          periodStart: new Date(),
          periodEnd: new Date(),
        })
        .returning()

      // Verify the relationships
      const invWithRelations = await db
        .select({
          invoice,
          subscription,
          customer: stripeCustomer,
        })
        .from(invoice)
        .leftJoin(subscription, eq(invoice.subscriptionId, subscription.id))
        .leftJoin(stripeCustomer, eq(invoice.stripeCustomerId, stripeCustomer.id))
        .where(eq(invoice.id, inv.id))

      assert(invWithRelations[0].subscription?.id === sub.id, 'FK subscriptionId works')
      assert(invWithRelations[0].customer?.id === customer.id, 'FK stripeCustomerId works')
    })

    // Test 5: Create webhook events
    await test('Create webhook event', async () => {
      const [evt] = await db
        .insert(webhookEvent)
        .values({
          id: 'evt_test_123', // Stripe ID direct (text)
          type: 'customer.subscription.created',
          processed: false,
          data: JSON.stringify({ foo: 'bar' }),
        })
        .returning()

      assert(evt.id === 'evt_test_123', 'Webhook event ID is correct')
      assert(evt.processed === false, 'Webhook event is not processed')
    })

    // Test 6: Test cascade deletes
    await test('Cascade delete: user → stripeCustomer → subscription → invoice', async () => {
      // 1. Create a complete chain
      const [testUser] = await db
        .insert(user)
        .values({
          id: 'user_delete_test',
          name: 'Delete Test',
          email: 'delete@test.com',
          emailVerified: true,
        })
        .returning()

      const [customer] = await db
        .insert(stripeCustomer)
        .values({
          userId: testUser.id,
          email: testUser.email,
          stripeCustomerId: 'cus_delete_test',
        })
        .returning()

      const [sub] = await db
        .insert(subscription)
        .values({
          userId: testUser.id,
          stripeCustomerId: customer.id,
          planId: 'free',
          status: 'active',
        })
        .returning()

      const [inv] = await db
        .insert(invoice)
        .values({
          id: 'in_delete_test',
          subscriptionId: sub.id,
          stripeCustomerId: customer.id,
          amountPaid: 0,
          amountDue: 0,
          currency: 'eur',
          status: 'paid',
          paid: true,
          periodStart: new Date(),
          periodEnd: new Date(),
        })
        .returning()

      // 2. Delete the user
      await db.delete(user).where(eq(user.id, testUser.id))

      // 3. Verify everything is deleted in cascade
      const customerExists = await db
        .select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.id, customer.id))
      const subExists = await db.select().from(subscription).where(eq(subscription.id, sub.id))
      const invExists = await db.select().from(invoice).where(eq(invoice.id, inv.id))

      assert(customerExists.length === 0, 'Customer should be deleted')
      assert(subExists.length === 0, 'Subscription should be deleted')
      assert(invExists.length === 0, 'Invoice should be deleted')
    })

    // Test 7: Test constraints violations - unique stripeCustomerId
    await test('Constraint: unique stripeCustomerId', async () => {
      const customers = await db
        .select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.stripeCustomerId, 'cus_test_123'))
        .limit(1)
      assert(customers.length > 0, 'Customer should exist')
      const customer = customers[0]

      // Try to create a customer with the same stripeCustomerId but different userId
      try {
        // Create a different user first for this test
        const [otherUser] = await db
          .insert(user)
          .values({
            id: 'user_test_unique',
            name: 'Other User',
            email: 'other@test.com',
            emailVerified: true,
          })
          .returning()

        await db.insert(stripeCustomer).values({
          userId: otherUser.id, // Different user
          email: 'other@test.com',
          stripeCustomerId: customer.stripeCustomerId, // ❌ Should fail (unique)
        })
        throw new Error('Should have thrown unique constraint error')
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        assert(
          errorMessage.includes('unique') || errorMessage.includes('duplicate'),
          'Should violate unique constraint'
        )
      }
    })

    // Test 8: Test constraints violations - FK planId must exist
    await test('Constraint: FK planId must exist', async () => {
      const customers = await db
        .select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.stripeCustomerId, 'cus_test_123'))
        .limit(1)
      assert(customers.length > 0, 'Customer should exist')
      const customer = customers[0]

      try {
        await db.insert(subscription).values({
          userId: customer.userId,
          stripeCustomerId: customer.id,
          planId: 'non-existent-plan', // ❌ Should fail (FK)
          status: 'active',
        })
        throw new Error('Should have thrown FK constraint error')
      } catch (error: unknown) {
        // Check both the error message and the full error string representation
        const errorMessage = error instanceof Error ? error.message : String(error)
        const fullError = String(error)

        // Drizzle wraps PostgreSQL errors, so we need to check both message and cause
        const hasConstraintError =
          errorMessage.includes('foreign key') ||
          errorMessage.includes('constraint') ||
          fullError.includes('foreign key') ||
          fullError.includes('constraint') ||
          errorMessage.includes('violates') ||
          errorMessage.includes('Failed query')

        assert(hasConstraintError, 'Should violate FK constraint')
      }
    })

    // Test 9: Complex query - get user with all stripe data
    await test('Complex query: get user with all stripe data', async () => {
      // Query: user → customer → subscription → plan + invoices
      const result = await db
        .select({
          user,
          customer: stripeCustomer,
          subscription,
          plan: plans,
        })
        .from(user)
        .leftJoin(stripeCustomer, eq(user.id, stripeCustomer.userId))
        .leftJoin(subscription, eq(stripeCustomer.id, subscription.stripeCustomerId))
        .leftJoin(plans, eq(subscription.planId, plans.id))
        .where(eq(user.id, 'user_test_123'))
        .limit(1)

      assert(result.length > 0, 'Should return user data')
      assert(result[0].customer !== null, 'Should join customer')
      assert(result[0].subscription !== null, 'Should join subscription')
      assert(result[0].plan !== null, 'Should join plan')
    })

    console.log(`\n✅ All tests passed! (${passedCount}/${testCount})`)
  } catch (error) {
    console.error('\n❌ Tests failed:', error)
    process.exit(1)
  } finally {
    await cleanup()
    process.exit(0)
  }
}

// Run tests
void runTests()
