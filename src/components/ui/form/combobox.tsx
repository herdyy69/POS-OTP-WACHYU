import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover'
import { Option } from '@/interfaces/shared'
import { Icons } from '../icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandOptions,
} from '../command/command'
import { Badge } from '../badge/badge'
import { useMemo, useState } from 'react'

const Combobox = ({
  value,
  error = false,
  multiple = false,
  createable = false,
  options,
  isOptionsLoading = false,
  placeholder,
  searchPlaceholder,
  className,
  disabled,
  onChange,
}: {
  value?: any
  error?: boolean
  multiple?: boolean
  createable?: boolean
  disabled?: boolean
  options: Option[]
  isOptionsLoading?: boolean
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  onChange: any
}) => {
  const [search, setSearch] = useState('')
  const [localOptions, setLocalOptions] = useState<Option[]>(options)

  const availableOption = options.some((option) => option.label.toLowerCase().includes(search.toLowerCase()))

  const handleCreateOption = () => {
    let newValues = value ? [...value] : []
    const newOption = { value: search, label: search }
    setLocalOptions((prevOptions) => [...prevOptions, newOption])
    onChange([...newValues, search])
    setSearch('')
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            role='combobox'
            className={cn(
              'form-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full items-center justify-between rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-[#F2F2F2] disabled:bg-[#F8F9FB] disabled:text-[#C7C7C8] sm:h-10 sm:rounded-md',
              !value && 'text-muted-foreground',
              error && 'error',
              className,
            )}
            disabled={disabled || isOptionsLoading}
          >
            {multiple
              ? value?.length
                ? `${value.length} selected`
                : placeholder
              : value
                ? localOptions?.find((option) => option?.value === value)?.label
                : placeholder}
            <Icons.ChevronDown className={cn('h-4 w-4')} />
          </button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0 sm:w-[200px]' align='start' onInteractOutside={() => setSearch('')}>
          <Command>
            <CommandInput
              placeholder={searchPlaceholder ?? 'Search...'}
              onChangeCapture={(e: any) => setSearch(e.target.value)}
            />
            <CommandList>
              {createable && multiple && !availableOption ? (
                <div
                  className={cn(
                    "data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-hidden hover:bg-[#f5f5f5] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                    className,
                  )}
                  onClick={handleCreateOption}
                >{`Create "${search}"`}</div>
              ) : (
                <CommandEmpty>No options found.</CommandEmpty>
              )}
              <CommandGroup>
                <CommandOptions options={localOptions} value={value} onChange={onChange} multiple={multiple} />
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {multiple && value?.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {Array.isArray(value) &&
            value?.map((val: string) => (
              <Badge key={val} className='flex items-center justify-between gap-2'>
                <span>{localOptions.find((option) => option.value === val)?.label}</span>
                <button
                  type='button'
                  onClick={() => {
                    const newValue = value.filter((item: string) => item !== val)
                    onChange(newValue)
                  }}
                >
                  <Icons.X className='h-3 w-3' />
                </button>
              </Badge>
            ))}
        </div>
      )}
    </>
  )
}

export default Combobox
