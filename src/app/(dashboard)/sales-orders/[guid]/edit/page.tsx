import { salesOrdersByGuid } from '@/service/sales-orders_service'
import { getStoresForDropdown } from '@/service/sales-orders_service'
import { FormUpdate } from './form'

export default async function Page({ params }: { params: Promise<{ guid: string }> }) {
  const { guid } = await params

  const [data, stores] = await Promise.all([salesOrdersByGuid(guid), getStoresForDropdown()])

  return (
    <FormUpdate
      data={{
        ...data,
        status: data.status as 'pending' | 'processing' | 'completed' | 'cancelled',
        createdAt: data.createdAt ?? undefined,
        updatedAt: data.updatedAt ?? undefined,
        notes: data.notes ?? undefined,
        storeName: data.storeName ?? undefined,
      }}
      stores={stores}
    />
  )
}
