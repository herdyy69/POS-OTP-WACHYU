import { Icons } from '@/components/ui/icons'
import { SearchParams } from '@/schemas/api'
import {
  transactionHistoryList,
  transactionSummary,
  topSellingProducts,
  topStores,
} from '@/service/transaction-history_service'
import { getStoresForDropdown } from '@/service/sales-orders_service'
import { TransactionHistoryTable } from './table'
import { TransactionFilters } from './filters'
import { TransactionSummary } from './summary'

interface ExtendedSearchParams extends SearchParams {
  storeGuid?: string
  status?: string
  startDate?: string
  endDate?: string
}

export default async function Page(params: { searchParams: Promise<ExtendedSearchParams> }) {
  const searchParams = await params.searchParams
  const { storeGuid, status, startDate, endDate } = searchParams

  const [data, summary, topProducts, topStoresData, stores] = await Promise.all([
    transactionHistoryList(searchParams),
    transactionSummary({ storeGuid, status, startDate, endDate }),
    topSellingProducts(5),
    topStores(5),
    getStoresForDropdown(),
  ])

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='card'>
        <div className='space-y-1'>
          <h1 className='plabs-title-medium-18 text-greyscale-9 sm:plabs-title-medium-20'>History Transaksi</h1>
          <p className='plabs-body-regular-12 text-greyscale-6 sm:plabs-body-regular-14'>
            Riwayat dan analisis transaksi penjualan
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <TransactionSummary summary={summary} />

      {/* Filters */}
      <TransactionFilters stores={stores} />

      {/* Transaction History Table */}
      <div className='card space-y-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h2 className='plabs-title-medium-16 text-greyscale-9 sm:plabs-title-medium-18'>Riwayat Transaksi</h2>
          <div className='flex gap-2'>
            <button className='btn-outline-greyscale text-xs sm:text-sm'>
              <Icons.File className='size-3 sm:size-4' />
              <span className='hidden sm:inline'>Export CSV</span>
              <span className='sm:hidden'>Export</span>
            </button>
            <button className='btn-outline-greyscale text-xs sm:text-sm'>
              <Icons.DocumentIcon className='size-3 sm:size-4' />
              <span className='hidden sm:inline'>Print</span>
              <span className='sm:hidden'>Print</span>
            </button>
          </div>
        </div>
        <TransactionHistoryTable data={data} />
      </div>

      {/* Analytics */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6'>
        {/* Top Products */}
        <div className='card space-y-4'>
          <h3 className='plabs-title-medium-14 text-greyscale-9 sm:plabs-title-medium-16'>Produk Terlaris</h3>
          <div className='space-y-3'>
            {topProducts.map((product, index) => (
              <div
                key={product.productGuid}
                className='bg-greyscale-1 flex items-center justify-between rounded-lg p-3'
              >
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-600 sm:h-8 sm:w-8 sm:text-sm'>
                    {index + 1}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='plabs-title-medium-12 text-greyscale-9 sm:plabs-title-medium-14 truncate'>
                      {product.productName}
                    </p>
                    <p className='plabs-body-regular-10 text-greyscale-6 sm:plabs-body-regular-12'>
                      {product.totalSold} terjual
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='plabs-title-medium-12 text-greyscale-9 sm:plabs-title-medium-14'>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(Number(product.totalRevenue))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stores */}
        <div className='card space-y-4'>
          <h3 className='plabs-title-medium-14 text-greyscale-9 sm:plabs-title-medium-16'>Toko Teratas</h3>
          <div className='space-y-3'>
            {topStoresData.map((store, index) => (
              <div key={store.storeGuid} className='bg-greyscale-1 flex items-center justify-between rounded-lg p-3'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 sm:h-8 sm:w-8 sm:text-sm'>
                    {index + 1}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='plabs-title-medium-12 text-greyscale-9 sm:plabs-title-medium-14 truncate'>
                      {store.storeName}
                    </p>
                    <p className='plabs-body-regular-10 text-greyscale-6 sm:plabs-body-regular-12'>
                      {store.totalOrders} pesanan
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='plabs-title-medium-12 text-greyscale-9 sm:plabs-title-medium-14'>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(Number(store.totalRevenue))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
