'use server'

import { SearchParams } from '../schemas/api'
import { InsertOrderItems, OrderItems } from '../schemas/order-items'
import { db } from '../db'
import { asc, desc, eq, sql } from 'drizzle-orm'
import { orderItems, products } from '../model/sales-schema'
import { createPagination } from '../lib/api'

export const orderItemsList = async (orderGuid: string, request: SearchParams) => {
  const { page = 1, limit = 10, order, sort } = await request

  const data = await db
    .select({
      guid: orderItems.guid,
      orderGuid: orderItems.orderGuid,
      productGuid: orderItems.productGuid,
      quantity: orderItems.quantity,
      soldPricePerUnit: orderItems.soldPricePerUnit,
      createdAt: orderItems.createdAt,
      updatedAt: orderItems.updatedAt,
      productName: products.name,
      totalPrice: sql<string>`${orderItems.quantity} * ${orderItems.soldPricePerUnit}`,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productGuid, products.guid))
    .where(eq(orderItems.orderGuid, orderGuid))
    .orderBy(desc(orderItems.createdAt))
    .limit(Number(limit))
    .offset((Number(page) - 1) * Number(limit))

  const totalData = await db
    .select({ count: sql<number>`count(*)` })
    .from(orderItems)
    .where(eq(orderItems.orderGuid, orderGuid))

  const pagination = createPagination(Number(totalData[0].count), Number(page), Number(limit))

  return {
    data,
    paginate: {
      ...pagination,
    },
  }
}

export const orderItemsById = async (guid: string) => {
  const data = await db
    .select({
      guid: orderItems.guid,
      orderGuid: orderItems.orderGuid,
      productGuid: orderItems.productGuid,
      quantity: orderItems.quantity,
      soldPricePerUnit: orderItems.soldPricePerUnit,
      productName: products.name,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productGuid, products.guid))
    .where(eq(orderItems.guid, guid))
    .limit(1)

  return data[0]
}

export const orderItemsInsert = async (data: InsertOrderItems) => {
  const { orderGuid, productGuid, quantity, soldPricePerUnit } = data

  const insertData = {
    orderGuid,
    productGuid,
    quantity: Number(quantity),
    soldPricePerUnit,
  }

  const result = await db.insert(orderItems).values(insertData).returning()

  return result[0]
}

export const orderItemsUpdate = async (guid: string, data: InsertOrderItems) => {
  const { orderGuid, productGuid, quantity, soldPricePerUnit } = data

  const updateData = {
    orderGuid,
    productGuid,
    quantity: Number(quantity),
    soldPricePerUnit,
    updatedAt: new Date(),
  }

  const result = await db.update(orderItems).set(updateData).where(eq(orderItems.guid, guid)).returning()

  return result[0]
}

export const orderItemsDelete = async (guid: string) => {
  const result = await db.delete(orderItems).where(eq(orderItems.guid, guid)).returning()

  return result[0]
}

// Get all products for dropdown
export const getProductsForDropdown = async () => {
  const data = await db
    .select({
      guid: products.guid,
      name: products.name,
      originalPrice: products.originalPrice,
      profitMarginPercentage: products.profitMarginPercentage,
    })
    .from(products)
    .orderBy(asc(products.name))

  return data
}
