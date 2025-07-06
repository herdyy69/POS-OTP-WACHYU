import { Icons } from '@/components/ui/icons'
import TableSearch from '@/components/ui/table/core/tableSearch'
import Link from 'next/link'
import { TableStores } from './table'
import { SearchParams } from '@/schemas/api'
import { storesList } from '@/service/stores_service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page(params: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await params.searchParams
  const data = await storesList(resolvedSearchParams)

  return (
    <div className='card space-y-4'>
      <div className='space-y-1'>
        <h1 className='plabs-title-medium-18 text-greyscale-9 sm:plabs-title-medium-20'>List Toko</h1>
        <p className='plabs-body-regular-12 text-greyscale-6 sm:plabs-body-regular-14'>Kelola toko pada halaman ini.</p>
      </div>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <TableSearch placeholder='Cari nama toko..' />
        </div>
        <Link href='/stores/create' className='btn-green text-xs sm:text-sm'>
          <span className='hidden sm:inline'>Tambah Toko</span>
          <span className='sm:hidden'>Tambah</span>
          <Icons.Plus className='size-3 sm:size-4' />
        </Link>
      </div>

      <TableStores data={data} />
    </div>
  )
}
