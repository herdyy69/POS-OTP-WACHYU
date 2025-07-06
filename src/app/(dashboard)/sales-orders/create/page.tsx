import { FormCreate } from './form'
import { getStoresForDropdown } from '@/service/sales-orders_service'
import { getProductsForDropdown } from '@/service/order-items_service'

export default async function Page() {
  const [stores, products] = await Promise.all([getStoresForDropdown(), getProductsForDropdown()])

  return <FormCreate stores={stores} products={products} />
}
