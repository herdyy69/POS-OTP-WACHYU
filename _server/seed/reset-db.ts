#!/usr/bin/env node

/**
 * Database Reset Script
 * This script will clear all data from the database tables
 */

import { db } from '../db'
import { products, stores, salesOrders, orderItems } from '../model/sales-schema'
import { people } from '../model/people'

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...')

    // Delete in reverse order to respect foreign key constraints
    console.log('🗑️  Deleting order items...')
    await db.delete(orderItems)

    console.log('🗑️  Deleting sales orders...')
    await db.delete(salesOrders)

    console.log('🗑️  Deleting products...')
    await db.delete(products)

    console.log('🗑️  Deleting stores...')
    await db.delete(stores)

    console.log('🗑️  Deleting people...')
    await db.delete(people)

    console.log('✅ Database reset completed successfully!')
    console.log('📊 All tables are now empty and ready for fresh data.')
  } catch (error) {
    console.error('❌ Database reset failed:', error)
    process.exit(1)
  }
}

const main = async () => {
  console.log('⚠️  WARNING: This will delete all data in the database!')
  console.log('🚀 Starting database reset...')

  await resetDatabase()

  console.log('🎉 Database reset completed!')
  console.log('💡 You can now run the seed script to populate with fresh data.')
}

main().catch((error) => {
  console.error('❌ Database reset failed:', error)
  process.exit(1)
})
