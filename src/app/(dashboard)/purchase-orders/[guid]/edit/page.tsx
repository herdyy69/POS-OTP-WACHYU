import { purchaseOrderByGuid } from '@/service/purchase-orders_service'
import { FormUpdate } from './form'

export default async function Page({ params }: { params: Promise<{ guid: string }> }) {
  const { guid } = await params

  const rawData = await purchaseOrderByGuid(guid)
  const data = {
    ...rawData,
    createdAt: rawData.createdAt ?? undefined,
    updatedAt: rawData.updatedAt ?? undefined,
    notes: rawData.notes ?? undefined,
    deliveryDate: rawData.deliveryDate ?? undefined,
  }

  return <FormUpdate data={data} />
}
