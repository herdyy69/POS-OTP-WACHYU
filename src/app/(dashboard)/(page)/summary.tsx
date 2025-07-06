'use client'

interface SummaryData {
  totalOrders: number
  totalRevenue: string
  totalProfit: string
  totalItems: number
}

export const TransactionSummary = ({ summary }: { summary: SummaryData }) => {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  const cards = [
    {
      title: 'Total Pesanan',
      value: summary.totalOrders.toString(),
      icon: '📋',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Pendapatan',
      value: formatCurrency(summary.totalRevenue),
      icon: '💰',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Keuntungan',
      value: formatCurrency(summary.totalProfit),
      icon: '📈',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Total Item Terjual',
      value: summary.totalItems.toString(),
      icon: '📦',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:gap-4'>
      {cards.map((card, index) => (
        <div key={index} className='card'>
          <div className='flex items-center justify-between'>
            <div className='min-w-0 flex-1'>
              <p className='plabs-body-regular-10 text-greyscale-6 sm:plabs-body-regular-12'>{card.title}</p>
              <p className='plabs-title-medium-16 text-greyscale-9 sm:plabs-title-medium-20 truncate'>{card.value}</p>
            </div>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-lg sm:h-12 sm:w-12 sm:text-2xl ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
