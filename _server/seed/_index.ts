import { PeopleSeeder } from './people'
import { productsSeeder } from './products'
import { storesSeeder } from './stores'
import { salesOrdersSeeder } from './sales-orders'
import { orderItemsSeeder } from './order-items'

const main = async () => {
  try {
    console.log('🚀 Starting seed process...')

    // Seed people first
    const people = await PeopleSeeder()
    console.log('People seeder completed:', people)

    // Seed products
    await productsSeeder()

    // Seed stores
    await storesSeeder()

    // Seed sales orders (depends on stores)
    await salesOrdersSeeder()

    // Seed order items (depends on sales orders and products)
    await orderItemsSeeder()

    console.log('🎉 All seeders completed successfully!')

    return {
      people,
      products: 'completed',
      stores: 'completed',
      salesOrders: 'completed',
      orderItems: 'completed',
    }
  } catch (error) {
    console.error('❌ Seed process failed:', error)
    process.exit(1)
  }
}

main()
  .then((result) => {
    console.log('✅ All seeders completed:', result)
  })
  .catch((error) => {
    console.error('❌ Seed process failed:', error)
  })
  .finally(() => {
    console.log('🏁 Seed process finished. Exiting...')
    process.exit(0)
  })
