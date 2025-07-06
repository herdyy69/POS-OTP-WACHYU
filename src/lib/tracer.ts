const getFormattedDate = () => {
  return new Date().toISOString()
}

export const tracer = {
  log: (message: string, ...rest: any) => {
    console.log(`${getFormattedDate()} - ${message}`, ...rest)
  },

  error: (message: string, error: Error, ...rest: any) => {
    console.error(error)
    console.error(`${getFormattedDate()} - ${message}`, error)
    console.error(`${getFormattedDate()} - data:`, ...rest)
  },
}
