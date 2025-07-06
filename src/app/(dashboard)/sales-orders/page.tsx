import { Icons } from '@/components/ui/icons'
import TableSearch from '@/components/ui/table/core/tableSearch'
import Link from 'next/link'
import { TableSalesOrders } from './table'
import { SearchParams } from '@/schemas/api'
import { salesOrdersList } from '@/service/sales-orders_service'

export default async function Page(params: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await params.searchParams
  const data = await salesOrdersList(resolvedSearchParams)

  return (
    <div className='card space-y-4'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-18 text-greyscale-9 sm:plabs-title-medium-20'>List Pesanan</h1>
        <p className='plabs-body-regular-12 text-greyscale-6 sm:plabs-body-regular-14'>
          Kelola pesanan pada halaman ini.
        </p>
      </div>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <TableSearch placeholder='Cari pesanan..' />
        </div>
        <Link href='/sales-orders/create' className='btn-green text-xs sm:text-sm'>
          <span className='hidden sm:inline'>Tambah Pesanan</span>
          <span className='sm:hidden'>Tambah</span>
          <Icons.Plus className='size-3 sm:size-4' />
        </Link>
      </div>
      <TableSalesOrders data={data} />
    </div>
  )
}
