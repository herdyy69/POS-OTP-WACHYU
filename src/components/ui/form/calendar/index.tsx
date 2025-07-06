import * as React from 'react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'

import { cn } from '@/lib/utils'

import { CustomCaption } from './customCaption'
import DateRangeTime from './dateRangeTime'
import 'react-day-picker/style.css'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn('p-3', className)}
        classNames={{
          month_caption: 'hidden',
          months: 'flex flex-col',
          month: 'space-y-2',
          caption_label: 'text-sm font-medium hidden',
          weekday: `text-sm font-medium pb-1.5 text-greyscale-9`,
          selected: `bg-blue-base text-white! rounded-md`,
          today: `${defaultClassNames.today} text-blue `,
          day_button: `${defaultClassNames.day_button} text-greyscale-9`,
          outside: `text-[#98A2B3]/50`,
          disabled: ` bg-greyscale-3`,
          day: 'text-greyscale-9 text-sm font-medium p-0',
          range_start: 'bg-blue rounded-l-full',
          range_end: 'bg-blue rounded-r-full',
          range_middle: 'rounded-none bg-blue-6/40',
          ...classNames,
        }}
        components={{
          Nav: (props: any) => <CustomCaption {...props} />,
        }}
        {...props}
      />

      {props.mode === 'range' && <DateRangeTime {...props} />}
    </>
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
