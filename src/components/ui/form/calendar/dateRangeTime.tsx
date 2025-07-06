import moment from 'moment'
import { ChangeEventHandler, useEffect, useState } from 'react'

const DateRangeTime = (props: any) => {
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const startTime = startDate ? moment(startDate).format('HH:mm') : ''
  const endTime = endDate ? moment(endDate).format('HH:mm') : ''

  const handleStartTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value
    if (!startDate) return

    const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10))
    const date = moment(startDate).set('hour', hours).set('minute', minutes).toDate()

    setStartDate(date)

    const payload = {
      from: date,
      to: endDate,
    }

    if (props?.onSelect) props.onSelect(payload)
  }

  const handleEndTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value
    if (!endDate) return

    const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10))
    const date = moment(endDate).set('hour', hours).set('minute', minutes).toDate()

    setEndDate(date)

    const payload = {
      from: startDate,
      to: date,
    }

    if (props?.onSelect) props.onSelect(payload)
  }

  useEffect(() => {
    if (props?.selected) {
      if (props?.selected?.from) setStartDate(props?.selected?.from)
      if (props?.selected?.to) setEndDate(props?.selected?.to)
    }
  }, [props?.selected])

  return (
    <div className='flex items-center gap-4 plabs-caption-regular-14 px-4 pb-4'>
      <div className='flex flex-col gap-2'>
        <label>Start Time: </label>
        <input
          type='time'
          value={startTime}
          onChange={handleStartTimeChange}
          className='form-input py-1.5 w-min'
          disabled={!startDate}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <label>End Time: </label>
        <input
          type='time'
          value={endTime}
          onChange={handleEndTimeChange}
          className='form-input py-1.5 w-min'
          disabled={!endDate}
        />
      </div>
    </div>
  )
}

export default DateRangeTime
