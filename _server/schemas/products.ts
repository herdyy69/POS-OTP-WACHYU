import { z } from 'zod'

const Products = z.object({
  guid: z.string(),
  name: z.string().min(1, 'Nama produk harus diisi'),
  description: z.string().optional(),
  imageUrl: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
  originalPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Harga asli harus berupa angka positif',
  }),
  profitMarginPercentage: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Margin keuntungan harus berupa angka positif',
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

const InsertProducts = Products.pick({
  name: true,
  description: true,
  imageUrl: true,
  originalPrice: true,
  profitMarginPercentage: true,
})

type Products = z.infer<typeof Products>
type InsertProducts = z.infer<typeof InsertProducts>

export { Products, InsertProducts }
