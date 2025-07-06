import { z } from 'zod'

const OrderItems = z.object({
  guid: z.string(),
  orderGuid: z.string(),
  productGuid: z.string(),
  quantity: z.number(),
  soldPricePerUnit: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  // Relations
  productName: z.string().optional(),
  totalPrice: z.string().optional(),
})

const InsertOrderItems = z.object({
  orderGuid: z.string().min(1, 'Order GUID harus diisi'),
  productGuid: z.string().min(1, 'Produk harus dipilih'),
  quantity: z.union([
    z.number().min(1, 'Jumlah minimal 1'),
    z
      .string()
      .min(1, 'Jumlah minimal 1')
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
        message: 'Jumlah minimal 1',
      }),
  ]),
  soldPricePerUnit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Harga jual harus berupa angka positif',
  }),
})

// Schema untuk form create item (tanpa orderGuid)
const CreateOrderItemForm = z.object({
  productGuid: z.string().min(1, 'Produk harus dipilih'),
  quantity: z.union([
    z.number().min(1, 'Jumlah minimal 1'),
    z
      .string()
      .min(1, 'Jumlah minimal 1')
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
        message: 'Jumlah minimal 1',
      }),
  ]),
  soldPricePerUnit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Harga jual harus berupa angka positif',
  }),
})

type OrderItems = z.infer<typeof OrderItems>
type InsertOrderItems = z.infer<typeof InsertOrderItems>
type CreateOrderItemForm = z.infer<typeof CreateOrderItemForm>

export { OrderItems, InsertOrderItems, CreateOrderItemForm }
