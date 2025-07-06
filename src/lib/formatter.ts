export const formatRupiah = (value?: string) => {
  if (!value) return ''
  let numberString = value.replace(/[^0-9]/g, '')
  if (numberString.startsWith('0') && numberString.length > 1) {
    numberString = numberString.replace(/^0+/, '')
  }
  let formatted = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return numberString ? `Rp ${formatted}` : ''
}

export const formatNumber = (value?: string) => {
  if (!value) return ''
  let numberString = value.replace(/[^0-9]/g, '')
  if (numberString.startsWith('0') && numberString.length > 1) {
    numberString = numberString.replace(/^0+/, '')
  }
  return Number(numberString)
}

export const formatRupiahForPrint = (value: string | number) => {
  const numValue = typeof value === 'string' ? Number(value) : value
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue)
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatCurrency = (value: string | number) => {
  const numValue = typeof value === 'string' ? Number(value) : value
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue)
}
