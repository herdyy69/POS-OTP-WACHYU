import { db } from '../db'
import { stores } from '../model/sales-schema'

export const storesSeeder = async () => {
  try {
    console.log('🌱 Seeding stores...')

    await db.insert(stores).values([
      {
        name: 'Toko Sehat Bersama',
        ownerName: 'Siti Nurhaliza',
        fullAddress: 'Jl. Merdeka No. 45, Kelurahan Sejahtera, Kecamatan Bahagia, Jakarta Selatan 12345',
        phoneNumber: '021-7654321',
        notes: 'Toko khusus produk organik dan kesehatan. Buka setiap hari kecuali Minggu.',
      },
      {
        name: 'Warung Pak Budi',
        ownerName: 'Budi Santoso',
        fullAddress: 'Jl. Raya Bogor KM 23, RT 05 RW 08, Kelurahan Sumber Jaya, Depok 16421',
        phoneNumber: '021-8765432',
        notes: 'Warung keluarga yang sudah berdiri sejak 1995. Spesialisasi produk lokal.',
      },
      {
        name: 'Minimarket Segar',
        ownerName: 'Ani Wijaya',
        fullAddress: 'Jl. Diponegoro No. 78, Kelurahan Mawar, Kecamatan Melati, Bandung 40123',
        phoneNumber: '022-1234567',
        notes: 'Minimarket modern dengan fokus pada produk segar dan berkualitas.',
      },
      {
        name: 'Toko Berkah Jaya',
        ownerName: 'Muhammad Rizki',
        fullAddress: 'Jl. Sudirman No. 156, Kelurahan Kenanga, Kecamatan Flamboyan, Surabaya 60111',
        phoneNumber: '031-9876543',
        notes: 'Toko sembako dan kebutuhan sehari-hari. Melayani grosir dan eceran.',
      },
      {
        name: 'Healthy Corner',
        ownerName: 'Dr. Maya Sari',
        fullAddress: 'Jl. Veteran No. 89, Kelurahan Dahlia, Kecamatan Anggrek, Yogyakarta 55234',
        phoneNumber: '0274-567890',
        notes: 'Toko khusus produk kesehatan dan suplemen. Pemilik adalah dokter berpengalaman.',
      },
      {
        name: 'Pasar Swalayan Indah',
        ownerName: 'Hendra Gunawan',
        fullAddress: 'Jl. Gatot Subroto No. 234, Kelurahan Tulip, Kecamatan Mawar, Medan 20145',
        phoneNumber: '061-2345678',
        notes: 'Swalayan besar dengan berbagai pilihan produk. Buka 24 jam.',
      },
      {
        name: 'Toko Organik Nusantara',
        ownerName: 'Indira Kusuma',
        fullAddress: 'Jl. Imam Bonjol No. 67, Kelurahan Cempaka, Kecamatan Jasmine, Semarang 50789',
        phoneNumber: '024-3456789',
        notes: 'Spesialis produk organik dari seluruh Indonesia. Kualitas premium.',
      },
      {
        name: 'Warung Mak Ijah',
        ownerName: 'Khadijah Umar',
        fullAddress: 'Jl. Panglima Sudirman No. 45, Kelurahan Seruni, Kecamatan Bougenville, Palembang 30678',
        phoneNumber: '0711-4567890',
        notes: 'Warung tradisional dengan sentuhan modern. Terkenal dengan pelayanan ramah.',
      },
      {
        name: 'Fresh Market',
        ownerName: 'Tommy Lim',
        fullAddress: 'Jl. Asia Afrika No. 123, Kelurahan Sakura, Kecamatan Lavender, Makassar 90123',
        phoneNumber: '0411-5678901',
        notes: 'Pasar segar dengan produk impor dan lokal. Kualitas terjamin.',
      },
      {
        name: 'Toko Barokah',
        ownerName: 'Abdul Rahman',
        fullAddress: 'Jl. Hayam Wuruk No. 234, Kelurahan Melati, Kecamatan Kamboja, Denpasar 80567',
        phoneNumber: '0361-6789012',
        notes: 'Toko keluarga dengan tradisi turun temurun. Fokus pada kepuasan pelanggan.',
      },
      {
        name: 'Supermarket Jaya Abadi',
        ownerName: 'Lina Marlina',
        fullAddress: 'Jl. Jendral Ahmad Yani No. 345, Kelurahan Kemuning, Kecamatan Teratai, Balikpapan 76123',
        phoneNumber: '0542-7890123',
        notes: 'Supermarket terbesar di kawasan dengan fasilitas lengkap dan parkir luas.',
      },
      {
        name: 'Toko Herbal Sehat',
        ownerName: 'Pak Hasan',
        fullAddress: 'Jl. Diponegoro No. 456, Kelurahan Kenanga, Kecamatan Lily, Pekanbaru 28456',
        phoneNumber: '0761-8901234',
        notes: 'Khusus produk herbal dan pengobatan tradisional. Konsultasi gratis.',
      },
    ])

    console.log('✅ Stores seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding stores:', error)
    throw error
  }
}
