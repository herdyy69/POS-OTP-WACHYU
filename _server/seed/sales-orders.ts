import { db } from '../db'
import { salesOrders, stores } from '../model/sales-schema'

export const salesOrdersSeeder = async () => {
  try {
    console.log('🌱 Seeding sales orders...')

    // Get all store GUIDs first
    const allStores = await db.select({ guid: stores.guid }).from(stores)
    const storeGuids = allStores.map((store) => store.guid)

    if (storeGuids.length === 0) {
      throw new Error('No stores found. Please seed stores first.')
    }

    // Generate orders for the past 3 months
    const orders = []
    const statuses = ['pending', 'processing', 'completed', 'cancelled']
    const currentDate = new Date()

    for (let i = 0; i < 50; i++) {
      // Random date within last 3 months
      const daysAgo = Math.floor(Math.random() * 90)
      const orderDate = new Date(currentDate)
      orderDate.setDate(currentDate.getDate() - daysAgo)

      // Random store GUID
      const storeGuid = storeGuids[Math.floor(Math.random() * storeGuids.length)]

      // Random status with higher probability for 'completed'
      const statusRandom = Math.random()
      let status: string
      if (statusRandom < 0.7) {
        status = 'completed'
      } else if (statusRandom < 0.85) {
        status = 'processing'
      } else if (statusRandom < 0.95) {
        status = 'pending'
      } else {
        status = 'cancelled'
      }

      // Random notes (50% chance of having notes)
      const notesOptions = [
        'Pesanan reguler pelanggan setia',
        'Pengiriman ekspres diminta',
        'Pembayaran tunai',
        'Pesanan untuk event khusus',
        'Pelanggan VIP',
        'Pesanan bulk dengan diskon',
        'Permintaan kemasan khusus',
        'Pengiriman pagi hari',
        null, // No notes
        null, // No notes
      ]

      const notes = notesOptions[Math.floor(Math.random() * notesOptions.length)]

      orders.push({
        storeGuid,
        orderDate,
        status,
        notes,
      })
    }

    await db.insert(salesOrders).values(orders)

    console.log('✅ Sales orders seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding sales orders:', error)
    throw error
  }
}
