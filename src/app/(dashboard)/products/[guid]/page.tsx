import { productsByGuid } from '@/service/products_service'
import { FormUpdate } from './form'

export default async function Page({ params }: { params: Promise<{ guid: string }> }) {
  const { guid } = await params

  const rawData = await productsByGuid(guid)
  const data = {
    ...rawData,
    createdAt: rawData.createdAt ?? undefined,
    updatedAt: rawData.updatedAt ?? undefined,
    description: rawData.description ?? undefined,
    imageUrl: rawData.imageUrl ?? undefined,
  }

  return <FormUpdate data={data} />
}
