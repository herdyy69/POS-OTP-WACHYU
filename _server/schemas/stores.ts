import { z } from 'zod'

const Stores = z.object({
  guid: z.string(),
  name: z.string().min(1, 'Nama toko harus diisi'),
  ownerName: z.string().min(1, 'Nama pemilik harus diisi'),
  fullAddress: z.string().min(1, 'Alamat lengkap harus diisi'),
  phoneNumber: z.string().min(1, 'Nomor telepon harus diisi'),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

const InsertStores = Stores.pick({
  name: true,
  ownerName: true,
  fullAddress: true,
  phoneNumber: true,
  notes: true,
})

type Stores = z.infer<typeof Stores>
type InsertStores = z.infer<typeof InsertStores>

export { Stores, InsertStores }
