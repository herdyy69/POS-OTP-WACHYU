import { z } from 'zod'

export const InsertPurchaseOrder = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  orderDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  status: z.enum(['draft', 'submitted', 'received', 'cancelled']).default('draft'),
  totalAmount: z.string().default('0'),
  notes: z.string().optional(),
})

export const UpdatePurchaseOrder = InsertPurchaseOrder.partial()

export const PurchaseOrder = InsertPurchaseOrder.extend({
  guid: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const InsertPurchaseOrderItem = z.object({
  purchaseOrderGuid: z.string().min(1, 'Purchase order GUID is required'),
  productGuid: z.string().min(1, 'Product GUID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.string().min(1, 'Unit price is required'),
  totalPrice: z.string().min(1, 'Total price is required'),
})

export const UpdatePurchaseOrderItem = InsertPurchaseOrderItem.partial()

export const PurchaseOrderItem = InsertPurchaseOrderItem.extend({
  guid: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type InsertPurchaseOrder = z.infer<typeof InsertPurchaseOrder>
export type UpdatePurchaseOrder = z.infer<typeof UpdatePurchaseOrder>
export type PurchaseOrder = z.infer<typeof PurchaseOrder>
export type InsertPurchaseOrderItem = z.infer<typeof InsertPurchaseOrderItem>
export type UpdatePurchaseOrderItem = z.infer<typeof UpdatePurchaseOrderItem>
export type PurchaseOrderItem = z.infer<typeof PurchaseOrderItem>
