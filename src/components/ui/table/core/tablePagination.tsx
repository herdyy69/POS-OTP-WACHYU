import { Table } from '@tanstack/react-table'
import { Icons } from '../../icons'

interface TablePaginationProps<TData> {
  table: Table<TData>
  isLoading?: boolean
  handleGoToPage: (page: number) => void
  handleSetPageRows: (limit: number) => void
  isServerSide?: boolean
  pageSizeOptions?: number[]
}

export default function TablePagination<TData>({
  table,
  isLoading,
  handleGoToPage,
  handleSetPageRows,
  isServerSide,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: TablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const totalData = isServerSide ? table.getRowCount() : table?.options?.data?.length

  const handleNextPage = () => {
    table.nextPage()
    handleGoToPage(table.getState().pagination.pageIndex + 1)
  }

  const handlePreviousPage = () => {
    table.previousPage()
    handleGoToPage(table.getState().pagination.pageIndex - 1)
  }

  const handleFirstPage = () => {
    table.firstPage()
    handleGoToPage(0)
  }
  const handleLastPage = () => {
    table.lastPage()
    handleGoToPage(table.getPageCount() - 1)
  }

  const handleChangePageSize = (e: any) => {
    table.setPageSize(Number(e.target.value))
    handleSetPageRows(Number(e.target.value))
  }

  if (isLoading) {
    return null
  }

  return (
    <div
      data-table-pagination
      className='flex flex-col gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2'
    >
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
        <div className='flex items-center gap-1 text-xs sm:text-sm'>
          <div className='text-greyscale-5 plabs-title-medium-10 mr-2'>Tampilkan :</div>
          <select
            className='text-greyscale-5 plabs-title-medium-10 h-auto rounded-lg border border-neutral-50 bg-white px-2 py-1 text-xs sm:text-sm'
            value={table.getState().pagination.pageSize}
            onChange={handleChangePageSize}
          >
            {pageSizeOptions?.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className='flex items-center gap-1'>
          <span className='text-greyscale-5 plabs-title-medium-10 text-xs sm:text-sm'>
            Menampilkan {(pageIndex || 0) * (table.getState().pagination.pageSize || 0) + 1} sampai{' '}
            {totalData - (pageIndex + 1) * table.getState().pagination.pageSize < 0
              ? totalData
              : (pageIndex + 1) * table.getState().pagination.pageSize}{' '}
            dari {totalData || 0} hasil
          </span>
        </div>
      </div>

      <div className='flex flex-row items-center gap-1'>
        {/* Previous Button */}
        <button
          className={`disabled:border-neutral-60 hover:bg-greyscale-2 text-greyscale-9 mr-1 h-8 rounded px-1.5 duration-150 ease-in-out ${
            pageIndex < 1 && 'text-greyscale-7 cursor-not-allowed'
          }`}
          onClick={handlePreviousPage}
          disabled={!table.getCanPreviousPage() || pageIndex < 1}
        >
          <Icons.ChevronLeft className='h-3 w-3' />
        </button>

        {/* First page */}
        {table.getState().pagination.pageIndex + 1 >= 4 && (
          <div
            onClick={handleFirstPage}
            className='hover:bg-greyscale-2 flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white px-1.5 duration-150 ease-in-out hover:cursor-pointer'
          >
            <span className='plabs-title-medium-10 text-greyscale-9 text-xs sm:text-sm'>1</span>
          </div>
        )}

        {/* Icon for more page */}
        {table.getState().pagination.pageIndex + 1 >= 5 && (
          <div className='flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white px-1.5 hover:cursor-pointer'>
            <Icons.Ellipsis />
          </div>
        )}

        {/* 2 pages before */}
        {table.getState().pagination.pageIndex + 1 - 2 > 0 && (
          <div
            onClick={() => {
              table.setPageIndex(table.getState().pagination.pageIndex - 2)
              handleGoToPage(table.getState().pagination.pageIndex - 2)
            }}
            className='hover:bg-greyscale-2 flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white px-1.5 duration-150 ease-in-out hover:cursor-pointer'
          >
            <span className='plabs-title-medium-10 text-greyscale-9 text-xs sm:text-sm'>
              {table.getState().pagination.pageIndex + 1 - 2}
            </span>
          </div>
        )}

        {/* 1 page before */}
        {table.getState().pagination.pageIndex + 1 - 1 > 0 && (
          <div
            onClick={() => {
              table.setPageIndex(table.getState().pagination.pageIndex - 1)
              handleGoToPage(table.getState().pagination.pageIndex - 1)
            }}
            className='hover:bg-greyscale-2 flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white px-1.5 duration-150 ease-in-out hover:cursor-pointer'
          >
            <span className='plabs-title-medium-10 text-greyscale-9 text-xs sm:text-sm'>
              {table.getState().pagination.pageIndex + 1 - 1}
            </span>
          </div>
        )}

        {/* Current page */}
        <div className='bg-primary-8 flex h-[30px] w-[30px] items-center justify-center rounded-lg px-1.5'>
          <span className='plabs-title-medium-10 text-xs text-white sm:text-sm'>
            {table.getState().pagination.pageIndex + 1}
          </span>
        </div>

        {/* 1 page after */}
        {table.getState().pagination.pageIndex + 1 + 1 <= table?.getPageCount() && (
          <div
            onClick={() => {
              table.setPageIndex(table.getState().pagination.pageIndex + 1)
              handleGoToPage(table.getState().pagination.pageIndex + 1)
            }}
            className='hover:bg-greyscale-2 flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white px-1.5 duration-150 ease-in-out hover:cursor-pointer'
          >
            <span className='plabs-title-medium-10 text-greyscale-9 text-xs sm:text-sm'>
              {table.getState().pagination.pageIndex + 1 + 1}
            </span>
          </div>
        )}

        {/* 2 pages after */}
        {table.getState().pagination.pageIndex + 1 + 2 <= table?.getPageCount() && (
          <div
            onClick={() => {
              table.setPageIndex(table.getState().pagination.pageIndex + 2)
              handleGoToPage(table.getState().pagination.pageIndex + 2)
            }}
            className='hover:bg-greyscale-2 flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white px-1.5 duration-150 ease-in-out hover:cursor-pointer'
          >
            <span className='plabs-title-medium-10 text-greyscale-9 text-xs sm:text-sm'>
              {table.getState().pagination.pageIndex + 1 + 2}
            </span>
          </div>
        )}

        {/* Icon for more page */}
        {table.getState().pagination.pageIndex + 1 + 2 < table?.getPageCount() - 1 && (
          <div className='flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white px-1.5 hover:cursor-pointer'>
            <Icons.Ellipsis />
          </div>
        )}

        {/* Last page */}
        {table.getState().pagination.pageIndex + 1 + 2 < table?.getPageCount() && (
          <>
            <div
              onClick={handleLastPage}
              className='hover:bg-greyscale-2 flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white px-1.5 duration-150 ease-in-out hover:cursor-pointer'
            >
              <span className='plabs-title-medium-10 text-greyscale-9 text-xs sm:text-sm'>{table?.getPageCount()}</span>
            </div>
          </>
        )}

        {/* Next Button */}
        <button
          className={`disabled:border-neutral-60 hover:bg-greyscale-2 text-greyscale-9 ml-1 h-8 rounded px-1.5 duration-150 ease-in-out ${
            !table.getCanNextPage() && 'text-greyscale-7 cursor-not-allowed'
          }`}
          onClick={handleNextPage}
          disabled={!table.getCanNextPage()}
        >
          <Icons.ChevronRight className='h-3 w-3' />
        </button>
      </div>
    </div>
  )
}
