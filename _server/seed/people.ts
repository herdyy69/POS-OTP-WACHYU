import { db } from '../db'
import { people } from '../model/people'

export async function PeopleSeeder() {
  const peoples = [
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'me@me.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      country: 'USA',
      zip: '12345',
    },
  ]

  await db.delete(people).execute()
  await db.insert(people).values(peoples).onConflictDoNothing().execute()
}
