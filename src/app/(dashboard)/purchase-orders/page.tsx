import { Icons } from '@/components/ui/icons'
import TableSearch from '@/components/ui/table/core/tableSearch'
import Link from 'next/link'
import { purchaseOrdersList } from '@/service/purchase-orders_service'
import { TablePurchaseOrders } from './table'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page(params: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await params.searchParams
  const data = await purchaseOrdersList(resolvedSearchParams)

  return (
    <div className='card space-y-4'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-18 text-greyscale-9 sm:plabs-title-medium-20'>Pesanan Pembelian</h1>
        <p className='plabs-body-regular-12 text-greyscale-6 sm:plabs-body-regular-14'>
          Kelola pesanan pembelian ke pusat berdasarkan pesanan toko.
        </p>
      </div>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <TableSearch placeholder='Cari nomor pesanan..' />
        </div>
        <Link href='/purchase-orders/generate' className='btn-green text-xs sm:text-sm'>
          <span className='hidden sm:inline'>Buat dari Penjualan</span>
          <span className='sm:hidden'>Buat</span>
          <Icons.Plus className='size-3 sm:size-4' />
        </Link>
      </div>

      <TablePurchaseOrders data={data} />
    </div>
  )
}
