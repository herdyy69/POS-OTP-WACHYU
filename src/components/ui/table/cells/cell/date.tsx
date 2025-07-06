import moment from 'moment'

const Date = ({ value, format, withTime = true }: { value?: string | Date; format?: string; withTime?: boolean }) => {
  if (!value) {
    return <>-</>
  }
  return (
    <div className='plabs-caption-regular-12 text-greyscale-6 w-[120px] flex flex-col items-start'>
      <div>{moment(value).format(format ?? 'DD MMMM YYYY')}</div>
      {withTime && <div>{moment(value).format('HH:mm')}</div>}
    </div>
  )
}

export default Date
