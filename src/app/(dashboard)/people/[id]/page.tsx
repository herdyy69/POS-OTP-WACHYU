import { peopleById } from '@/service/poeple_service'
import { FormUpdate } from './form'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const data = (await peopleById(id)) as any

  return <FormUpdate data={data} />
}
