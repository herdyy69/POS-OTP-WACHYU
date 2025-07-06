export default function LoadingSpinner() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='flex flex-col items-center space-y-4'>
        <div className='relative'>
          <div className='h-12 w-12 rounded-full border-4 border-blue-200'></div>
          <div className='absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
        </div>
        <div className='text-sm font-medium text-gray-600'>Loading...</div>
      </div>
    </div>
  )
}
