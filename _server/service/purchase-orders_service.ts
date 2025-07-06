'use server'

import { SearchParams } from '../schemas/api'
import { InsertPurchaseOrder, UpdatePurchaseOrder, PurchaseOrder } from '../schemas/purchase-orders'
import { db } from '../db'
import { asc, desc, eq, sql, ilike, and, gte, lte } from 'drizzle-orm'
import { purchaseOrders, purchaseOrderItems, salesOrders, orderItems, products, stores } from '../model/sales-schema'
import { createPagination } from '../lib/api'

export const purchaseOrdersList = async (request: SearchParams) => {
  const { search = '', page = 1, limit = 10, order, sort, startDate, endDate, status } = await request

  // Define valid order columns
  const validOrderColumns = {
    guid: purchaseOrders.guid,
    orderNumber: purchaseOrders.orderNumber,
    orderDate: purchaseOrders.orderDate,
    deliveryDate: purchaseOrders.deliveryDate,
    status: purchaseOrders.status,
    totalAmount: purchaseOrders.totalAmount,
    createdAt: purchaseOrders.createdAt,
    updatedAt: purchaseOrders.updatedAt,
  }

  // Build where clause
  const whereConditions = []

  if (search) {
    whereConditions.push(ilike(purchaseOrders.orderNumber, `%${search}%`))
  }

  if (startDate) {
    whereConditions.push(gte(purchaseOrders.orderDate, new Date(startDate)))
  }

  if (endDate) {
    whereConditions.push(lte(purchaseOrders.orderDate, new Date(endDate)))
  }

  if (status) {
    whereConditions.push(eq(purchaseOrders.status, status))
  }

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

  const data = await db
    .select({
      guid: purchaseOrders.guid,
      orderNumber: purchaseOrders.orderNumber,
      orderDate: purchaseOrders.orderDate,
      deliveryDate: purchaseOrders.deliveryDate,
      status: purchaseOrders.status,
      totalAmount: purchaseOrders.totalAmount,
      notes: purchaseOrders.notes,
      createdAt: purchaseOrders.createdAt,
      updatedAt: purchaseOrders.updatedAt,
      totalItems: sql<number>`COALESCE(COUNT(${purchaseOrderItems.guid}), 0)`,
    })
    .from(purchaseOrders)
    .leftJoin(purchaseOrderItems, eq(purchaseOrders.guid, purchaseOrderItems.purchaseOrderGuid))
    .where(whereClause)
    .groupBy(purchaseOrders.guid)
    .orderBy(
      order && order in validOrderColumns
        ? sort === 'ASC'
          ? asc(validOrderColumns[order as keyof typeof validOrderColumns])
          : desc(validOrderColumns[order as keyof typeof validOrderColumns])
        : desc(purchaseOrders.createdAt),
    )
    .limit(Number(limit))
    .offset((Number(page) - 1) * Number(limit))

  const totalData = await db
    .select({ count: sql<number>`count(*)` })
    .from(purchaseOrders)
    .where(whereClause)

  const pagination = createPagination(Number(totalData[0].count), Number(page), Number(limit))

  return {
    data,
    paginate: {
      ...pagination,
    },
  }
}

export const purchaseOrderByGuid = async (guid: string) => {
  const data = await db
    .select({
      guid: purchaseOrders.guid,
      orderNumber: purchaseOrders.orderNumber,
      orderDate: purchaseOrders.orderDate,
      deliveryDate: purchaseOrders.deliveryDate,
      status: purchaseOrders.status,
      totalAmount: purchaseOrders.totalAmount,
      notes: purchaseOrders.notes,
      createdAt: purchaseOrders.createdAt,
      updatedAt: purchaseOrders.updatedAt,
    })
    .from(purchaseOrders)
    .where(eq(purchaseOrders.guid, guid))
    .limit(1)

  return data[0]
}

export const getPurchaseOrderStores = async (guid: string) => {
  // Get all stores that have sales orders
  const data = await db
    .select({
      storeGuid: stores.guid,
      storeName: stores.name,
      ownerName: stores.ownerName,
      fullAddress: stores.fullAddress,
      phoneNumber: stores.phoneNumber,
      orderCount: sql<number>`COUNT(DISTINCT ${salesOrders.guid})`,
    })
    .from(stores)
    .leftJoin(salesOrders, eq(stores.guid, salesOrders.storeGuid))
    .groupBy(stores.guid, stores.name, stores.ownerName, stores.fullAddress, stores.phoneNumber)
    .having(sql`COUNT(DISTINCT ${salesOrders.guid}) > 0`)

  return data
}

export const purchaseOrderItemsByOrderGuid = async (orderGuid: string) => {
  const data = await db
    .select({
      guid: purchaseOrderItems.guid,
      purchaseOrderGuid: purchaseOrderItems.purchaseOrderGuid,
      productGuid: purchaseOrderItems.productGuid,
      quantity: purchaseOrderItems.quantity,
      unitPrice: purchaseOrderItems.unitPrice,
      totalPrice: purchaseOrderItems.totalPrice,
      createdAt: purchaseOrderItems.createdAt,
      updatedAt: purchaseOrderItems.updatedAt,
      productName: products.name,
      productDescription: products.description,
    })
    .from(purchaseOrderItems)
    .leftJoin(products, eq(purchaseOrderItems.productGuid, products.guid))
    .where(eq(purchaseOrderItems.purchaseOrderGuid, orderGuid))

  return data
}

export const purchaseOrderInsert = async (data: InsertPurchaseOrder) => {
  const insertData = {
    ...data,
    orderDate: data.orderDate ? new Date(data.orderDate) : new Date(),
    deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
  }
  const result = await db.insert(purchaseOrders).values(insertData).returning()
  return result[0]
}

export const purchaseOrderUpdate = async (guid: string, data: UpdatePurchaseOrder) => {
  const updateData = {
    ...data,
    orderDate: data.orderDate ? new Date(data.orderDate) : undefined,
    deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
    updatedAt: new Date(),
  }
  const result = await db.update(purchaseOrders).set(updateData).where(eq(purchaseOrders.guid, guid)).returning()
  return result[0]
}

export const purchaseOrderDelete = async (guid: string) => {
  // Delete related items first
  await db.delete(purchaseOrderItems).where(eq(purchaseOrderItems.purchaseOrderGuid, guid))

  // Delete purchase order
  const result = await db.delete(purchaseOrders).where(eq(purchaseOrders.guid, guid)).returning()
  return result[0]
}

// Generate purchase order from sales orders
export const generatePurchaseOrderFromSales = async (startDate: string, endDate: string, orderNumber: string) => {
  // Get all sales orders within date range
  const salesData = await db
    .select({
      productGuid: orderItems.productGuid,
      productName: products.name,
      originalPrice: products.originalPrice,
      totalQuantity: sql<number>`SUM(${orderItems.quantity})`,
      totalAmount: sql<string>`SUM(${orderItems.quantity} * ${orderItems.soldPricePerUnit})`,
    })
    .from(salesOrders)
    .leftJoin(orderItems, eq(salesOrders.guid, orderItems.orderGuid))
    .leftJoin(products, eq(orderItems.productGuid, products.guid))
    .where(and(gte(salesOrders.orderDate, new Date(startDate)), lte(salesOrders.orderDate, new Date(endDate))))
    .groupBy(orderItems.productGuid, products.name, products.originalPrice)

  if (salesData.length === 0) {
    throw new Error('No sales orders found in the specified date range')
  }

  // Calculate total amount
  const totalAmount = salesData.reduce((sum, item) => {
    return sum + Number(item.originalPrice) * Number(item.totalQuantity)
  }, 0)

  // Create purchase order
  const purchaseOrder = await purchaseOrderInsert({
    orderNumber,
    orderDate: new Date().toISOString(),
    status: 'draft',
    totalAmount: totalAmount.toString(),
    notes: `Generated from sales orders between ${startDate} and ${endDate}`,
  })

  // Create purchase order items
  const validItems = salesData.filter((item) => item.productGuid && item.totalQuantity)

  for (const item of validItems) {
    const totalPrice = Number(item.originalPrice) * Number(item.totalQuantity)

    await db.insert(purchaseOrderItems).values({
      purchaseOrderGuid: purchaseOrder.guid,
      productGuid: item.productGuid,
      quantity: Number(item.totalQuantity),
      unitPrice: item.originalPrice,
      totalPrice: totalPrice.toString(),
    } as any)
  }

  return purchaseOrder
}

// Get purchase order summary
export const getPurchaseOrderSummary = async (startDate?: string, endDate?: string) => {
  const whereConditions = []

  if (startDate) {
    whereConditions.push(gte(purchaseOrders.orderDate, new Date(startDate)))
  }

  if (endDate) {
    whereConditions.push(lte(purchaseOrders.orderDate, new Date(endDate)))
  }

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

  const summary = await db
    .select({
      totalOrders: sql<number>`COUNT(*)`,
      totalAmount: sql<string>`COALESCE(SUM(${purchaseOrders.totalAmount}), 0)`,
      draftOrders: sql<number>`COUNT(CASE WHEN ${purchaseOrders.status} = 'draft' THEN 1 END)`,
      submittedOrders: sql<number>`COUNT(CASE WHEN ${purchaseOrders.status} = 'submitted' THEN 1 END)`,
      receivedOrders: sql<number>`COUNT(CASE WHEN ${purchaseOrders.status} = 'received' THEN 1 END)`,
    })
    .from(purchaseOrders)
    .where(whereClause)

  return summary[0]
}
