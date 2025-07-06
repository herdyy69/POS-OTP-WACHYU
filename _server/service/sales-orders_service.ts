'use server'

import { SearchParams } from '../schemas/api'
import { InsertSalesOrders, SalesOrders } from '../schemas/sales-orders'
import { db } from '../db'
import { asc, desc, eq, sql, ilike } from 'drizzle-orm'
import { salesOrders, stores, orderItems, products } from '../model/sales-schema'
import { createPagination } from '../lib/api'

export const salesOrdersList = async (request: SearchParams) => {
  const { search = '', page = 1, limit = 10, order, sort } = await request

  // Define valid order columns
  const validOrderColumns = {
    guid: salesOrders.guid,
    storeGuid: salesOrders.storeGuid,
    orderDate: salesOrders.orderDate,
    status: salesOrders.status,
    notes: salesOrders.notes,
    createdAt: salesOrders.createdAt,
    updatedAt: salesOrders.updatedAt,
  }

  // Get orders with store info and totals
  const data = await db
    .select({
      guid: salesOrders.guid,
      storeGuid: salesOrders.storeGuid,
      orderDate: salesOrders.orderDate,
      status: salesOrders.status,
      notes: salesOrders.notes,
      createdAt: salesOrders.createdAt,
      updatedAt: salesOrders.updatedAt,
      storeName: stores.name,
      totalAmount: sql<string>`COALESCE(SUM(${orderItems.quantity} * ${orderItems.soldPricePerUnit}), 0)`,
      totalItems: sql<number>`COALESCE(COUNT(${orderItems.guid}), 0)`,
    })
    .from(salesOrders)
    .leftJoin(stores, eq(salesOrders.storeGuid, stores.guid))
    .leftJoin(orderItems, eq(salesOrders.guid, orderItems.orderGuid))
    .where(search ? ilike(stores.name, `%${search}%`) : undefined)
    .groupBy(salesOrders.guid, stores.name)
    .orderBy(
      order && order in validOrderColumns
        ? sort === 'ASC'
          ? asc(validOrderColumns[order as keyof typeof validOrderColumns])
          : desc(validOrderColumns[order as keyof typeof validOrderColumns])
        : desc(salesOrders.createdAt),
    )
    .limit(Number(limit))
    .offset((Number(page) - 1) * Number(limit))

  const totalData = await db
    .select({ count: sql<number>`count(*)` })
    .from(salesOrders)
    .leftJoin(stores, eq(salesOrders.storeGuid, stores.guid))
    .where(search ? ilike(stores.name, `%${search}%`) : undefined)

  const pagination = createPagination(Number(totalData[0].count), Number(page), Number(limit))

  return {
    data,
    paginate: {
      ...pagination,
    },
  }
}

export const salesOrdersByGuid = async (guid: string) => {
  const data = await db
    .select({
      guid: salesOrders.guid,
      storeGuid: salesOrders.storeGuid,
      orderDate: salesOrders.orderDate,
      status: salesOrders.status,
      notes: salesOrders.notes,
      createdAt: salesOrders.createdAt,
      updatedAt: salesOrders.updatedAt,
      storeName: stores.name,
    })
    .from(salesOrders)
    .leftJoin(stores, eq(salesOrders.storeGuid, stores.guid))
    .where(eq(salesOrders.guid, guid))
    .limit(1)

  return data[0]
}

export const salesOrdersWithItems = async (guid: string) => {
  const orderData = await salesOrdersByGuid(guid)

  const items = await db
    .select({
      guid: orderItems.guid,
      orderGuid: orderItems.orderGuid,
      productGuid: orderItems.productGuid,
      quantity: orderItems.quantity,
      soldPricePerUnit: orderItems.soldPricePerUnit,
      productName: products.name,
      totalPrice: sql<string>`${orderItems.quantity} * ${orderItems.soldPricePerUnit}`,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productGuid, products.guid))
    .where(eq(orderItems.orderGuid, guid))

  return {
    order: orderData,
    items,
  }
}

export const salesOrdersInsert = async (data: InsertSalesOrders) => {
  const { storeGuid, orderDate, status, notes } = data

  const insertData = {
    storeGuid,
    orderDate: new Date(orderDate),
    status,
    notes,
  }

  const result = await db.insert(salesOrders).values(insertData).returning()

  return result[0]
}

export const salesOrdersUpdate = async (guid: string, data: InsertSalesOrders) => {
  const { storeGuid, orderDate, status, notes } = data

  const updateData = {
    storeGuid,
    orderDate: new Date(orderDate),
    status,
    notes,
    updatedAt: new Date(),
  }

  const result = await db.update(salesOrders).set(updateData).where(eq(salesOrders.guid, guid)).returning()

  return result[0]
}

export const salesOrdersDelete = async (guid: string) => {
  // First delete related order items
  await db.delete(orderItems).where(eq(orderItems.orderGuid, guid))

  // Then delete the order
  const result = await db.delete(salesOrders).where(eq(salesOrders.guid, guid)).returning()

  return result[0]
}

// Get all stores for dropdown
export const getStoresForDropdown = async () => {
  const data = await db
    .select({
      guid: stores.guid,
      name: stores.name,
    })
    .from(stores)
    .orderBy(asc(stores.name))

  return data
}
