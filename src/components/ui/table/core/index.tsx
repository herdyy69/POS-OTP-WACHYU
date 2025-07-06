import * as React from 'react'

import { cn } from '@/lib/utils'
import Image from 'next/image'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className = '', ...props }, ref) => (
    <div className='relative w-full overflow-auto'>
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  ),
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />,
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  ),
)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('border-t bg-neutral-50 font-medium last:[&>tr]:border-b-0', className)}
      {...props}
    />
  ),
)
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('hover:bg-neutral-30 data-[state=selected]:bg-neutral-30 transition-colors', className)}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  ),
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <td ref={ref} className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
  ),
)
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className = '', ...props }, ref) => (
    <caption ref={ref} className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
  ),
)
TableCaption.displayName = 'TableCaption'

const TableSkeleton: any = ({ totalColumns, totalRow = 10 }: { totalColumns: number; totalRow: number }) => {
  const convertToArr = (num: number) => {
    const arr = []
    for (let i = 1; i <= num; i++) {
      arr.push(i)
    }
    return arr
  }

  const columns = convertToArr(totalColumns)
  const rows = convertToArr(totalRow)

  return rows.map((index) => {
    return (
      <TableRow key={index}>
        {columns.map((j) => {
          return (
            <TableCell key={j} className='px-2 py-2' style={{ width: `${100 / columns.length}%` }}>
              <div className='h-10 animate-pulse rounded bg-gray-300' />
            </TableCell>
          )
        })}
      </TableRow>
    )
  })
}

TableSkeleton.displayName = 'TableSkeleton'

const TableEmpty = ({ totalColumns, text }: { totalColumns: number; text?: string }) => {
  return (
    <TableRow>
      <td className='px-4 py-5' colSpan={totalColumns}>
        <div className='flex min-h-[200px] flex-col items-center justify-center gap-4 sm:min-h-[300px]'>
          <Image
            src='/assets/images/general/no_data.png'
            alt='empty-data'
            width={338}
            height={173}
            className='h-auto w-[200px] sm:w-[338px]'
          />
          <span className='text-greyscale-5 plabs-title-medium-10 sm:plabs-title-medium-12 max-w-[250px] text-center sm:max-w-[338px]'>
            Belum ada data {text}, klik tombol tambah untuk menambah data.
          </span>
        </div>
      </td>
    </TableRow>
  )
}

TableEmpty.displayName = 'TableEmpty'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableSkeleton,
  TableEmpty,
}
