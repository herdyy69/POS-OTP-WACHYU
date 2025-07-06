import { Badge } from '@/components/ui/badge/badge'
import { Button } from '@/components/ui/button/button'
import { ArrowLeft, Edit, Printer } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/formatter'
import {
  purchaseOrderByGuid,
  purchaseOrderItemsByOrderGuid,
  getPurchaseOrderStores,
} from '@/service/purchase-orders_service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page({ params }: { params: Promise<{ guid: string }> }) {
  const { guid } = await params
  const purchaseOrder = await purchaseOrderByGuid(guid)
  const items = await purchaseOrderItemsByOrderGuid(guid)
  const stores = await getPurchaseOrderStores(guid)

  if (!purchaseOrder) {
    return <div>Purchase order not found</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'received':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft'
      case 'submitted':
        return 'Dikirim'
      case 'received':
        return 'Diterima'
      case 'cancelled':
        return 'Dibatalkan'
      default:
        return status
    }
  }

  return (
    <div className='card space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='plabs-title-medium-20 text-greyscale-9'>Detail Pesanan Pembelian</h1>
        <div className='flex gap-2'>
          <Link href={`/purchase-orders/${guid}/edit`}>
            <Button className='btn-green'>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </Button>
          </Link>
          <Button className='btn-outline-greyscale'>
            <Printer className='mr-2 h-4 w-4' />
            Print
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-1'>
          <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
            Informasi Order
          </div>
          <div className='space-y-4 p-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='plabs-body-regular-14 text-greyscale-6'>Nomor Pesanan</label>
                <p className='plabs-title-medium-16 text-greyscale-9'>{purchaseOrder.orderNumber}</p>
              </div>
              <div>
                <label className='plabs-body-regular-14 text-greyscale-6'>Status</label>
                <div className='mt-1'>
                  <Badge className={getStatusColor(purchaseOrder.status)}>{getStatusLabel(purchaseOrder.status)}</Badge>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='plabs-body-regular-14 text-greyscale-6'>Tanggal Pesanan</label>
                <p className='plabs-body-regular-14 text-greyscale-9'>
                  {formatDate(purchaseOrder.orderDate.toString())}
                </p>
              </div>
              <div>
                <label className='plabs-body-regular-14 text-greyscale-6'>Tanggal Pengiriman</label>
                <p className='plabs-body-regular-14 text-greyscale-9'>
                  {purchaseOrder.deliveryDate ? formatDate(purchaseOrder.deliveryDate.toString()) : '-'}
                </p>
              </div>
            </div>
            <div>
              <label className='plabs-body-regular-14 text-greyscale-6'>Total Jumlah</label>
              <p className='plabs-title-medium-20 text-green-600'>{formatCurrency(purchaseOrder.totalAmount)}</p>
            </div>
            {purchaseOrder.notes && (
              <div>
                <label className='plabs-body-regular-14 text-greyscale-6'>Catatan</label>
                <p className='plabs-body-regular-14 text-greyscale-9'>{purchaseOrder.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className='lg:col-span-2'>
          <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
            Toko yang Terlibat
          </div>
          <div className='p-4'>
            {stores && stores.length > 0 ? (
              <div className='space-y-4'>
                {stores.map((store: any) => (
                  <div key={store.storeGuid} className='border-greyscale-4 rounded-lg border p-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h4 className='plabs-title-medium-16 text-greyscale-9'>{store.storeName}</h4>
                        <p className='plabs-body-regular-14 text-greyscale-6'>Pemilik: {store.ownerName}</p>
                        <p className='plabs-body-regular-14 text-greyscale-6'>Alamat: {store.fullAddress}</p>
                        <p className='plabs-body-regular-14 text-greyscale-6'>Telepon: {store.phoneNumber}</p>
                      </div>
                      <div className='text-right'>
                        <Badge className='bg-blue-100 text-blue-800'>{store.orderCount} Pesanan</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='plabs-body-regular-14 text-greyscale-6 py-4 text-center'>Tidak ada data toko ditemukan</p>
            )}
          </div>
        </div>
      </div>

      <div className=''>
        <div className='bg-primary-background plabs-title-medium-16 text-primary-base w-full rounded-2xl px-3 py-2.5'>
          Item Pesanan
        </div>
        <div className='p-4'>
          {items && items.length > 0 ? (
            <div className='space-y-4'>
              {items.map((item: any) => (
                <div key={item.guid} className='border-greyscale-4 rounded-lg border p-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h4 className='plabs-title-medium-16 text-greyscale-9'>{item.productName}</h4>
                      <p className='plabs-body-regular-14 text-greyscale-6'>{item.productDescription}</p>
                    </div>
                    <div className='text-right'>
                      <p className='plabs-title-medium-16 text-greyscale-9'>{formatCurrency(item.totalPrice)}</p>
                      <p className='plabs-body-regular-14 text-greyscale-6'>
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='plabs-body-regular-14 text-greyscale-6 py-4 text-center'>Tidak ada item ditemukan</p>
          )}
        </div>
      </div>
    </div>
  )
}
