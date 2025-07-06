'use server'

import { SearchParams } from '../schemas/api'
import { InsertPeople, People } from '../schemas/people'
import { db } from '../db'
import { asc, desc, eq, sql } from 'drizzle-orm'
import { people } from '../model/people'
import { createPagination } from '../lib/api'

type OrderByField = keyof People

export const peopleList = async (request: SearchParams) => {
  const { search = '', page = 1, limit = 10, order, sort } = await request

  const data = await db.query.people.findMany({
    columns: {
      guid: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      zip: true,
    },
    where: (people, { ilike }) => ilike(people.first_name, `%${search}%`) || ilike(people.last_name, `%${search}%`),
    orderBy: order
      ? sort === 'ASC'
        ? asc(people[order as OrderByField])
        : desc(people[order as OrderByField])
      : undefined,
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit),
  })

  const totalData = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM people
      WHERE ${(() => {
        const conditions = []
        if (search) {
          conditions.push(sql`${people.first_name} ILIKE ${`%${search}%`}`)
          conditions.push(sql`${people.last_name} ILIKE ${`%${search}%`}`)
        }
        return conditions.length > 0 ? conditions.reduce((a, b) => sql`${a} AND ${b}`) : sql`true`
      })()}
    `)

  const pagination = createPagination(Number(totalData[0].count), Number(page), Number(limit))

  return {
    data,
    paginate: {
      ...pagination,
    },
  }
}

export const peopleById = async (guid: string) => {
  const data = await db.query.people.findFirst({
    where: (people, { eq }) => eq(people.guid, guid),
  })

  return data
}

export const peopleInsert = async (data: InsertPeople) => {
  const { first_name, last_name, email, phone, address, city, state, country, zip } = data

  const insertData = {
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    state,
    country,
    zip,
  }

  const result = await db.insert(people).values(insertData).returning().execute()

  return result
}

export const peopleUpdate = async (guid: string, data: InsertPeople) => {
  const { first_name, last_name, email, phone, address, city, state, country, zip } = data

  const updateData = {
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    state,
    country,
    zip,
  }

  const result = await db.update(people).set(updateData).where(eq(people.guid, guid)).returning().execute()

  return result
}

export const peopleDelete = async (guid: string) => {
  const result = await db.delete(people).where(eq(people.guid, guid)).returning().execute()

  return result
}
