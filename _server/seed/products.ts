import { db } from '../db'
import { products } from '../model/sales-schema'

export const productsSeeder = async () => {
  try {
    console.log('🌱 Seeding products...')

    await db.insert(products).values([
      {
        name: 'Teh Hijau Premium',
        description: 'Teh hijau berkualitas tinggi dengan aroma yang menyegarkan',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        originalPrice: '25000',
        profitMarginPercentage: '40',
      },
      {
        name: 'Kopi Arabica Specialty',
        description: 'Kopi arabica pilihan dengan rasa yang kaya dan aroma yang menggoda',
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
        originalPrice: '45000',
        profitMarginPercentage: '35',
      },
      {
        name: 'Susu Almond Organik',
        description: 'Susu almond organik tanpa pemanis buatan',
        imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
        originalPrice: '35000',
        profitMarginPercentage: '30',
      },
      {
        name: 'Madu Hutan Murni',
        description: 'Madu murni dari hutan dengan kualitas terbaik',
        imageUrl: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400',
        originalPrice: '75000',
        profitMarginPercentage: '25',
      },
      {
        name: 'Granola Mix',
        description: 'Campuran granola dengan kacang-kacangan dan buah kering',
        imageUrl: 'https://images.unsplash.com/photo-1571197119282-7c4e99d9c3d2?w=400',
        originalPrice: '40000',
        profitMarginPercentage: '45',
      },
      {
        name: 'Yogurt Greek Original',
        description: 'Yogurt Greek dengan tekstur kental dan rasa asli',
        imageUrl: 'https://images.unsplash.com/photo-1571212515416-fccf29a9d42d?w=400',
        originalPrice: '18000',
        profitMarginPercentage: '50',
      },
      {
        name: 'Olive Oil Extra Virgin',
        description: 'Minyak zaitun extra virgin untuk memasak sehat',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
        originalPrice: '85000',
        profitMarginPercentage: '20',
      },
      {
        name: 'Beras Organik Merah',
        description: 'Beras organik merah dengan kandungan nutrisi tinggi',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        originalPrice: '30000',
        profitMarginPercentage: '35',
      },
      {
        name: 'Quinoa Seeds',
        description: 'Biji quinoa super food dengan protein tinggi',
        imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400',
        originalPrice: '55000',
        profitMarginPercentage: '30',
      },
      {
        name: 'Chia Seeds Premium',
        description: 'Biji chia premium kaya akan omega-3 dan serat',
        imageUrl: 'https://images.unsplash.com/photo-1569097092540-6f9f1e4a7b6d?w=400',
        originalPrice: '50000',
        profitMarginPercentage: '40',
      },
      {
        name: 'Matcha Powder',
        description: 'Bubuk matcha asli dari Jepang untuk minuman dan kue',
        imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
        originalPrice: '95000',
        profitMarginPercentage: '25',
      },
      {
        name: 'Coconut Oil Virgin',
        description: 'Minyak kelapa virgin untuk masak dan perawatan',
        imageUrl: 'https://images.unsplash.com/photo-1608000084535-a62f6b71b2e4?w=400',
        originalPrice: '42000',
        profitMarginPercentage: '35',
      },
      {
        name: 'Protein Powder Vanilla',
        description: 'Protein powder rasa vanilla untuk suplemen fitness',
        imageUrl: 'https://images.unsplash.com/photo-1597003954450-0e3a4ad6e8a8?w=400',
        originalPrice: '150000',
        profitMarginPercentage: '30',
      },
      {
        name: 'Kombucha Original',
        description: 'Minuman fermentasi kombucha dengan probiotik alami',
        imageUrl: 'https://images.unsplash.com/photo-1568652447688-3e6b2e9b9d4c?w=400',
        originalPrice: '28000',
        profitMarginPercentage: '45',
      },
      {
        name: 'Almond Butter',
        description: 'Selai almond murni tanpa gula tambahan',
        imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400',
        originalPrice: '68000',
        profitMarginPercentage: '25',
      },
    ])

    console.log('✅ Products seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    throw error
  }
}
