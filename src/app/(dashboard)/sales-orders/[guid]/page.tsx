import { salesOrdersWithItems } from '@/service/sales-orders_service'
import { getProductsForDropdown } from '@/service/order-items_service'
import { OrderDetail } from './detail'

export default async function Page({ params }: { params: Promise<{ guid: string }> }) {
  const { guid } = await params

  const data = await salesOrdersWithItems(guid)
  const products = await getProductsForDropdown()

  // Convert Date objects to strings for the component
  const dataWithStringDates = {
    ...data,
    order: {
      ...data.order,
      orderDate: data.order.orderDate.toISOString(),
      createdAt: data.order.createdAt?.toISOString() || null,
      updatedAt: data.order.updatedAt?.toISOString() || null,
      notes: data.order.notes || '',
      storeName: data.order.storeName || '',
    },
  } as any

  return <OrderDetail data={dataWithStringDates} products={products} />
}
