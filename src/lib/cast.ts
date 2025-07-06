import moment from 'moment'

export function castToNumberOrKeepString(value: string) {
  const number = Number(value)
  return isNaN(number) ? value : number
}

export const formatCurrency = (amount: number = 0, currency = 'IDR', locale = 'id-ID') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}
