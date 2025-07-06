#!/usr/bin/env node

/**
 * Database Setup Script
 * This script will run migrations and seed the database with sample data
 */

import { execSync } from 'child_process'
import { resolve } from 'path'

const runCommand = (command: string, description: string) => {
  try {
    console.log(`🔄 ${description}...`)
    execSync(command, { stdio: 'inherit', cwd: resolve(__dirname, '..') })
    console.log(`✅ ${description} completed successfully!`)
  } catch (error) {
    console.error(`❌ ${description} failed:`, error)
    process.exit(1)
  }
}

const main = async () => {
  console.log('🚀 Starting database setup...')

  // Run migrations
  runCommand('npx drizzle-kit push:pg', 'Running database migrations')

  // Run seeders
  runCommand('npx tsx _server/seed/_index.ts', 'Seeding database with sample data')

  console.log('🎉 Database setup completed successfully!')
  console.log('📊 Your database is now ready with sample data for:')
  console.log('   - People')
  console.log('   - Products (15 items)')
  console.log('   - Stores (12 stores)')
  console.log('   - Sales Orders (50 orders)')
  console.log('   - Order Items (related to orders)')
}

main().catch((error) => {
  console.error('❌ Database setup failed:', error)
  process.exit(1)
})
