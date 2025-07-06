import { pgTable, integer, text, varchar, timestamp, decimal, serial } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  guid: text('guid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 255 }),
  originalPrice: decimal('original_price', { precision: 12, scale: 2 }).notNull(),
  profitMarginPercentage: decimal('profit_margin_percentage', { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const stores = pgTable('stores', {
  guid: text('guid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  ownerName: varchar('owner_name', { length: 255 }).notNull(),
  fullAddress: text('full_address').notNull(),
  phoneNumber: varchar('phone_number', { length: 30 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const salesOrders = pgTable('sales_orders', {
  guid: text('guid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeGuid: text('store_guid')
    .notNull()
    .references(() => stores.guid),
  orderDate: timestamp('order_date').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const orderItems = pgTable('order_items', {
  guid: text('guid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderGuid: text('order_guid')
    .notNull()
    .references(() => salesOrders.guid),
  productGuid: text('product_guid')
    .notNull()
    .references(() => products.guid),
  quantity: integer('quantity').notNull(),
  soldPricePerUnit: decimal('sold_price_per_unit', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Purchase Orders (Pesanan ke Pusat)
export const purchaseOrders = pgTable('purchase_orders', {
  guid: text('guid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  orderDate: timestamp('order_date').notNull().defaultNow(),
  deliveryDate: timestamp('delivery_date'),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, submitted, received, cancelled
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Purchase Order Items
export const purchaseOrderItems = pgTable('purchase_order_items', {
  guid: text('guid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  purchaseOrderGuid: text('purchase_order_guid')
    .notNull()
    .references(() => purchaseOrders.guid),
  productGuid: text('product_guid')
    .notNull()
    .references(() => products.guid),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
