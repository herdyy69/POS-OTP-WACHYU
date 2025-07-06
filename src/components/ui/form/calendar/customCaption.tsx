import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useClickOutsideElement } from '@/hooks/useClickOutsideElement'
import { Icons } from '../../icons'
import { useDayPicker } from 'react-day-picker'
import moment from 'moment'

interface CaptionMonthAndYearProps {
  navigation: any
  onClose: () => void
}

export function CustomCaption(props: any) {
  const { months: displayMonth, goToMonth } = useDayPicker()
  const [showMonth, setShowMonth] = useState<boolean>(false)
  const monthRef = useRef<HTMLDivElement>(null)

  useClickOutsideElement(monthRef, () => {
    setShowMonth(false)
  })

  return (
    <>
      <CaptionComponent
        onPreviousClick={() => props.onPreviousClick(props.previousMonth)}
        onNextClick={() => props.onNextClick(props.nextMonth)}
        formattedDate={moment(displayMonth[0].date).format('MMMM, YYYY')}
        onDateClick={() => setShowMonth(!showMonth)}
      />
      {showMonth && (
        <div id='show_list_month' className='absolute top-0 left-0 w-full h-full z-20' ref={monthRef}>
          <CaptionMonth
            navigation={{
              currentMonth: displayMonth[0].date,
              goToMonth,
            }}
            onClose={() => setShowMonth(false)}
          />
        </div>
      )}
    </>
  )
}

const CaptionMonth = ({ navigation, onClose }: CaptionMonthAndYearProps) => {
  const { currentMonth, goToMonth } = navigation
  const currentYear = moment(currentMonth).year()
  const currentMonthIndex = moment(currentMonth).month()

  const [rangeYear, setRangeYear] = useState<boolean>(false)
  const yearRef = useRef<HTMLDivElement>(null)

  useClickOutsideElement(yearRef, () => {
    setRangeYear(false)
  })

  const months = Array.from({ length: 12 }, (_, index) => ({
    label: moment().month(index).format('MMM'),
    value: index,
  }))

  const handleMonthChange = (monthIndex: number) => {
    goToMonth(moment(currentMonth).month(monthIndex).toDate())
    onClose()
  }

  return (
    <>
      <div className='relative bg-white py-3 px-4 shadow-xl'>
        <CaptionComponent
          onPreviousClick={() => goToMonth(moment(currentMonth).subtract(1, 'year').toDate())}
          onNextClick={() => goToMonth(moment(currentMonth).add(1, 'year').toDate())}
          formattedDate={`${currentYear}`}
          onDateClick={() => setRangeYear(!rangeYear)}
        />

        <div className='mt-2 grid grid-cols-3 gap-x-4 gap-y-2'>
          {months.map((month, index) => {
            return (
              <button
                key={index}
                className={`flex items-center justify-center py-2 text-sm font-medium px-3 rounded-md cursor-pointer ${
                  month.value === currentMonthIndex ? 'bg-blue-base text-white' : ''
                }`}
                onClick={() => handleMonthChange(month.value)}
                type='button'
              >
                {month.label.slice(0, 3).toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

      {rangeYear && (
        <div className='absolute top-0 left-0 w-full h-full z-20'>
          <div ref={yearRef}>
            <CaptionRangeYear navigation={navigation} onClose={() => setRangeYear(false)} />
          </div>
        </div>
      )}
    </>
  )
}

const CaptionRangeYear = ({ navigation, onClose }: CaptionMonthAndYearProps) => {
  const currentYear = moment(navigation.currentMonth).year()

  const yearList = () => {
    const years = []
    const baseYear = Math.floor(currentYear / 10) * 10
    const startYear = baseYear - 1
    const endYear = startYear + 11

    for (let year = startYear; year <= endYear; year++) {
      years.push({
        label: year,
        value: year,
        selected: year === currentYear,
      })
    }

    return years
  }

  const handleChange = (year: any) => {
    const newDate = moment(navigation.currentMonth).year(year.value).toDate()
    navigation.goToMonth(newDate)
    onClose()
  }

  const goToYear = (year: any) => {
    const newDate = moment(navigation.currentMonth).year(year).toDate()
    navigation.goToMonth(newDate)
  }

  const handlePreviousClick = () => {
    const previousYear = yearList()[0].value - 11
    goToYear(previousYear + 6)
  }

  const handleNextClick = () => {
    const currentEnd = yearList()[yearList().length - 1].value
    const newStart = currentEnd
    goToYear(newStart)
  }

  const years = yearList()
  const disableFirstYear = years[0].value
  const disableLastYear = years[years.length - 1].value

  return (
    <div className='relative bg-white py-3 px-4 shadow-xl'>
      <CaptionComponent
        onPreviousClick={handlePreviousClick}
        onNextClick={handleNextClick}
        formattedDate={`${yearList()[0].label} - ${yearList()[yearList().length - 1].label}`}
      />

      <div className='mt-2 grid grid-cols-3 gap-x-4 gap-y-2'>
        {yearList().map((year: any) => {
          return (
            <button
              key={year.value}
              className={cn(
                `flex items-center justify-center py-2 text-sm font-medium px-3 rounded-md cursor-pointer`,
                [
                  year.value === disableFirstYear || year.value === disableLastYear ? 'text-[#98A2B3]' : '',
                  year.selected ? 'bg-blue-base text-white' : '',
                ],
              )}
              onClick={() => handleChange(year)}
              disabled={year.value === disableFirstYear || year.value === disableLastYear}
              type='button'
            >
              {year.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const CaptionComponent = ({
  onPreviousClick,
  onNextClick,
  formattedDate,
  onDateClick,
}: {
  onPreviousClick: () => void
  onNextClick: () => void
  formattedDate: any
  onDateClick?: () => void
}) => (
  <div className='flex items-center justify-between bg-[#F6F8FA] rounded-lg px-1.5 py-1.5'>
    <button
      onClick={onPreviousClick}
      className='h-6 w-6 bg-transparent p-0 flex justify-center items-center rounded-md bg-white drop-shadow-md hover:bg-text-subtle-grey duration-200 ease-in-out'
      type='button'
    >
      <Icons.ChevronLeft className='h-3 w-3' />
    </button>
    <button className='plabs-caption-regular-sm text-text-black' onClick={onDateClick} type='button'>
      {formattedDate}
    </button>
    <button
      onClick={onNextClick}
      className='h-6 w-6 bg-transparent p-0 flex justify-center items-center rounded-md bg-white drop-shadow-md hover:bg-text-subtle-grey duration-200 ease-in-out'
      type='button'
    >
      <Icons.ChevronRight className='h-3 w-3' />
    </button>
  </div>
)
