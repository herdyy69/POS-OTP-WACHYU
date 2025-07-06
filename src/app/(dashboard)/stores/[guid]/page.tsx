import { storesByGuid } from '@/service/stores_service'
import { FormUpdate } from './form'

export default async function Page({ params }: { params: Promise<{ guid: string }> }) {
  const { guid } = await params

  const data = await storesByGuid(guid)

  return (
    <FormUpdate
      data={{
        ...data,
        createdAt: data.createdAt ?? undefined,
        updatedAt: data.updatedAt ?? undefined,
        notes: data.notes ?? undefined,
      }}
    />
  )
}
