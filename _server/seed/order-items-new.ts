import { db } from '../db'
import { orderItems, salesOrders, products } from '../model/sales-schema'

export const orderItemsSeeder = async () => {
  try {
    console.log('🌱 Seeding order items...')

    // Get all order GUIDs and product GUIDs
    const allOrders = await db.select({ guid: salesOrders.guid }).from(salesOrders)
    const allProducts = await db
      .select({
        guid: products.guid,
        originalPrice: products.originalPrice,
        profitMarginPercentage: products.profitMarginPercentage,
      })
      .from(products)

    if (allOrders.length === 0) {
      throw new Error('No orders found. Please seed sales orders first.')
    }

    if (allProducts.length === 0) {
      throw new Error('No products found. Please seed products first.')
    }

    const items = []

    for (const order of allOrders) {
      // Random number of items per order (1-5 items)
      const itemCount = Math.floor(Math.random() * 5) + 1
      const usedProductGuids = new Set()

      for (let i = 0; i < itemCount; i++) {
        // Random product
        let product = allProducts[Math.floor(Math.random() * allProducts.length)]

        // Ensure no duplicate products in the same order
        while (usedProductGuids.has(product.guid)) {
          product = allProducts[Math.floor(Math.random() * allProducts.length)]
        }
        usedProductGuids.add(product.guid)

        // Random quantity (1-10)
        const quantity = Math.floor(Math.random() * 10) + 1

        // Calculate sold price based on product original price + margin
        const originalPrice = Number(product.originalPrice)
        const margin = Number(product.profitMarginPercentage)
        const basePrice = originalPrice * (1 + margin / 100)

        // Add some random variation to the sold price (±10%)
        const variation = (Math.random() - 0.5) * 0.2 // -10% to +10%
        const soldPricePerUnit = Math.round(basePrice * (1 + variation))

        items.push({
          orderGuid: order.guid,
          productGuid: product.guid,
          quantity,
          soldPricePerUnit: soldPricePerUnit.toString(),
        })
      }
    }

    await db.insert(orderItems).values(items)

    console.log('✅ Order items seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding order items:', error)
    throw error
  }
}
