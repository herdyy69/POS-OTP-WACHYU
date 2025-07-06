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
