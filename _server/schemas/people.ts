import { z } from 'zod'

const People = z.object({
  guid: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
})

const InsertPeople = People.pick({
  first_name: true,
  last_name: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  country: true,
  zip: true,
})

type People = z.infer<typeof People>
type InsertPeople = z.infer<typeof InsertPeople>

export { People, InsertPeople }
