'use server'

import { SearchParams } from '../schemas/api'
import { InsertStores, Stores } from '../schemas/stores'
import { db } from '../db'
import { asc, desc, eq, sql, ilike } from 'drizzle-orm'
import { stores } from '../model/sales-schema'
import { createPagination } from '../lib/api'

type OrderByField = keyof Stores

export const storesList = async (request: SearchParams) => {
  const { search = '', page = 1, limit = 10, order, sort } = await request

  const data = await db
    .select({
      guid: stores.guid,
      name: stores.name,
      ownerName: stores.ownerName,
      fullAddress: stores.fullAddress,
      phoneNumber: stores.phoneNumber,
      notes: stores.notes,
      createdAt: stores.createdAt,
      updatedAt: stores.updatedAt,
    })
    .from(stores)
    .where(search ? ilike(stores.name, `%${search}%`) : undefined)
    .orderBy(
      order && Object.keys(stores).includes(order)
        ? sort === 'ASC'
          ? asc(stores[order as OrderByField])
          : desc(stores[order as OrderByField])
        : desc(stores.createdAt),
    )
    .limit(Number(limit))
    .offset((Number(page) - 1) * Number(limit))

  const totalData = await db
    .select({ count: sql<number>`count(*)` })
    .from(stores)
    .where(search ? ilike(stores.name, `%${search}%`) : undefined)

  const pagination = createPagination(Number(totalData[0].count), Number(page), Number(limit))

  return {
    data,
    paginate: {
      ...pagination,
    },
  }
}

export const storesByGuid = async (guid: string) => {
  const data = await db.select().from(stores).where(eq(stores.guid, guid)).limit(1)

  return data[0]
}

export const storesInsert = async (data: InsertStores) => {
  const { name, ownerName, fullAddress, phoneNumber, notes } = data

  const insertData = {
    name,
    ownerName,
    fullAddress,
    phoneNumber,
    notes,
  }

  const result = await db.insert(stores).values(insertData).returning()

  return result[0]
}

export const storesUpdate = async (guid: string, data: InsertStores) => {
  const { name, ownerName, fullAddress, phoneNumber, notes } = data

  const updateData = {
    name,
    ownerName,
    fullAddress,
    phoneNumber,
    notes,
    updatedAt: new Date(),
  }

  const result = await db.update(stores).set(updateData).where(eq(stores.guid, guid)).returning()

  return result[0]
}

export const storesDelete = async (guid: string) => {
  const result = await db.delete(stores).where(eq(stores.guid, guid)).returning()

  return result[0]
}
