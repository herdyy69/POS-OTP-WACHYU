import { pgTable, text, varchar } from 'drizzle-orm/pg-core'

const people = pgTable('people', {
  guid: text('guid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  first_name: varchar('first_name', { length: 255 }).notNull(),
  last_name: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  zip: varchar('zip', { length: 255 }).notNull(),
})

export { people }
