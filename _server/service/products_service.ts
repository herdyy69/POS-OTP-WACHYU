'use server'

import { SearchParams } from '../schemas/api'
import { InsertProducts, Products } from '../schemas/products'
import { db } from '../db'
import { asc, desc, eq, sql, ilike } from 'drizzle-orm'
import { products } from '../model/sales-schema'
import { createPagination } from '../lib/api'

type OrderByField = keyof Products

export const productsList = async (request: SearchParams) => {
  const { search = '', page = 1, limit = 10, order, sort } = await request

  const data = await db
    .select({
      guid: products.guid,
      name: products.name,
      description: products.description,
      imageUrl: products.imageUrl,
      originalPrice: products.originalPrice,
      profitMarginPercentage: products.profitMarginPercentage,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(search ? ilike(products.name, `%${search}%`) : undefined)
    .orderBy(
      order && Object.keys(products).includes(order)
        ? sort === 'ASC'
          ? asc(products[order as OrderByField])
          : desc(products[order as OrderByField])
        : desc(products.createdAt),
    )
    .limit(Number(limit))
    .offset((Number(page) - 1) * Number(limit))

  const totalData = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(search ? ilike(products.name, `%${search}%`) : undefined)

  const pagination = createPagination(Number(totalData[0].count), Number(page), Number(limit))

  return {
    data,
    paginate: {
      ...pagination,
    },
  }
}

export const productsByGuid = async (guid: string) => {
  const data = await db.select().from(products).where(eq(products.guid, guid)).limit(1)

  return data[0]
}

export const productsInsert = async (data: InsertProducts) => {
  const { name, description, imageUrl, originalPrice, profitMarginPercentage } = data

  const insertData = {
    name,
    description,
    imageUrl: imageUrl || null,
    originalPrice,
    profitMarginPercentage,
  }

  const result = await db.insert(products).values(insertData).returning()

  return result[0]
}

export const productsUpdate = async (guid: string, data: InsertProducts) => {
  const { name, description, imageUrl, originalPrice, profitMarginPercentage } = data

  const updateData = {
    name,
    description,
    imageUrl: imageUrl || null,
    originalPrice,
    profitMarginPercentage,
    updatedAt: new Date(),
  }

  const result = await db.update(products).set(updateData).where(eq(products.guid, guid)).returning()

  return result[0]
}

export const productsDelete = async (guid: string) => {
  const result = await db.delete(products).where(eq(products.guid, guid)).returning()

  return result[0]
}
