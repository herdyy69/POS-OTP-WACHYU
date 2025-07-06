import { z } from 'zod'

const SalesOrders = z.object({
  guid: z.string(),
  storeGuid: z.string(),
  orderDate: z.date(),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  // Relations
  storeName: z.string().optional(),
  totalAmount: z.string().optional(),
  totalItems: z.number().optional(),
})

const InsertSalesOrders = z.object({
  storeGuid: z.string().min(1, 'Toko harus dipilih'),
  orderDate: z.string().min(1, 'Tanggal order harus diisi'),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).default('pending'),
  notes: z.string().optional(),
})

type SalesOrders = z.infer<typeof SalesOrders>
type InsertSalesOrders = z.infer<typeof InsertSalesOrders>

export { SalesOrders, InsertSalesOrders }
