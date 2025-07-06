'use server'

import { SearchParams } from '../schemas/api'
import { db } from '../db'
import { desc, eq, sql, ilike, and, gte, lte } from 'drizzle-orm'
import { salesOrders, stores, orderItems, products } from '../model/sales-schema'
import { createPagination } from '../lib/api'

export const transactionHistoryList = async (
  request: SearchParams & {
    storeGuid?: string
    status?: string
    startDate?: string
    endDate?: string
  },
) => {
  const { search = '', page = 1, limit = 10, storeGuid, status, startDate, endDate } = await request

  // Build where conditions
  const whereConditions = []

  if (search) {
    whereConditions.push(ilike(stores.name, `%${search}%`))
  }

  if (storeGuid) {
    whereConditions.push(eq(salesOrders.storeGuid, storeGuid))
  }

  if (status) {
    whereConditions.push(eq(salesOrders.status, status))
  }

  if (startDate) {
    whereConditions.push(gte(salesOrders.orderDate, new Date(startDate)))
  }

  if (endDate) {
    whereConditions.push(lte(salesOrders.orderDate, new Date(endDate)))
  }

  const whereClause =
    whereConditions.length > 0
      ? whereConditions.slice(1).reduce((acc, condition) => and(acc, condition)!, whereConditions[0])
      : undefined

  // Get transaction history with details
  const data = await db
    .select({
      guid: salesOrders.guid,
      storeGuid: salesOrders.storeGuid,
      storeName: stores.name,
      orderDate: salesOrders.orderDate,
      status: salesOrders.status,
      notes: salesOrders.notes,
      createdAt: salesOrders.createdAt,
      totalAmount: sql<string>`COALESCE(SUM(${orderItems.quantity} * ${orderItems.soldPricePerUnit}), 0)`,
      totalItems: sql<number>`COALESCE(COUNT(${orderItems.guid}), 0)`,
      totalProfit: sql<string>`COALESCE(SUM(
        (${orderItems.soldPricePerUnit} - ${products.originalPrice}) * ${orderItems.quantity}
      ), 0)`,
    })
    .from(salesOrders)
    .leftJoin(stores, eq(salesOrders.storeGuid, stores.guid))
    .leftJoin(orderItems, eq(salesOrders.guid, orderItems.orderGuid))
    .leftJoin(products, eq(orderItems.productGuid, products.guid))
    .where(whereClause)
    .groupBy(salesOrders.guid, stores.name)
    .orderBy(desc(salesOrders.createdAt))
    .limit(Number(limit))
    .offset((Number(page) - 1) * Number(limit))

  const totalData = await db
    .select({ count: sql<number>`count(*)` })
    .from(salesOrders)
    .leftJoin(stores, eq(salesOrders.storeGuid, stores.guid))
    .where(whereClause)

  const pagination = createPagination(Number(totalData[0].count), Number(page), Number(limit))

  return {
    data,
    paginate: {
      ...pagination,
    },
  }
}

export const transactionSummary = async (filters: {
  storeGuid?: string
  status?: string
  startDate?: string
  endDate?: string
}) => {
  const { storeGuid, status, startDate, endDate } = filters

  // Build where conditions
  const whereConditions = []

  if (storeGuid) {
    whereConditions.push(eq(salesOrders.storeGuid, storeGuid))
  }

  if (status) {
    whereConditions.push(eq(salesOrders.status, status))
  }

  if (startDate) {
    whereConditions.push(gte(salesOrders.orderDate, new Date(startDate)))
  }

  if (endDate) {
    whereConditions.push(lte(salesOrders.orderDate, new Date(endDate)))
  }

  const whereClause =
    whereConditions.length > 0
      ? whereConditions.slice(1).reduce((acc, condition) => and(acc, condition)!, whereConditions[0])
      : undefined

  const summary = await db
    .select({
      totalOrders: sql<number>`COUNT(DISTINCT ${salesOrders.guid})`,
      totalRevenue: sql<string>`COALESCE(SUM(${orderItems.quantity} * ${orderItems.soldPricePerUnit}), 0)`,
      totalProfit: sql<string>`COALESCE(SUM(
        (${orderItems.soldPricePerUnit} - ${products.originalPrice}) * ${orderItems.quantity}
      ), 0)`,
      totalItems: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)`,
    })
    .from(salesOrders)
    .leftJoin(orderItems, eq(salesOrders.guid, orderItems.orderGuid))
    .leftJoin(products, eq(orderItems.productGuid, products.guid))
    .where(whereClause)

  return summary[0]
}

export const topSellingProducts = async (limit = 10) => {
  const data = await db
    .select({
      productGuid: products.guid,
      productName: products.name,
      totalSold: sql<number>`SUM(${orderItems.quantity})`,
      totalRevenue: sql<string>`SUM(${orderItems.quantity} * ${orderItems.soldPricePerUnit})`,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productGuid, products.guid))
    .leftJoin(salesOrders, eq(orderItems.orderGuid, salesOrders.guid))
    .where(eq(salesOrders.status, 'completed'))
    .groupBy(products.guid, products.name)
    .orderBy(sql`SUM(${orderItems.quantity}) DESC`)
    .limit(limit)

  return data
}

export const topStores = async (limit = 10) => {
  const data = await db
    .select({
      storeGuid: stores.guid,
      storeName: stores.name,
      totalOrders: sql<number>`COUNT(DISTINCT ${salesOrders.guid})`,
      totalRevenue: sql<string>`SUM(${orderItems.quantity} * ${orderItems.soldPricePerUnit})`,
    })
    .from(salesOrders)
    .leftJoin(stores, eq(salesOrders.storeGuid, stores.guid))
    .leftJoin(orderItems, eq(salesOrders.guid, orderItems.orderGuid))
    .where(eq(salesOrders.status, 'completed'))
    .groupBy(stores.guid, stores.name)
    .orderBy(sql`SUM(${orderItems.quantity} * ${orderItems.soldPricePerUnit}) DESC`)
    .limit(limit)

  return data
}
