const ImportIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={props.className}
    >
      <mask
        id='mask0_8126_451'
        style={{
          maskType: 'alpha',
        }}
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='18'
        height='18'
      >
        <mask
          id='mask1_8126_451'
          style={{
            maskType: 'alpha',
          }}
          maskUnits='userSpaceOnUse'
          x='0'
          y='0'
          width='18'
          height='18'
        >
          <rect width='18' height='18' fill='currentColor' />
        </mask>
        <g mask='url(#mask1_8126_451)'>
          <path
            d='M8.25 12V5.8875L6.3 7.8375L5.25 6.75L9 3L12.75 6.75L11.7 7.8375L9.75 5.8875V12H8.25ZM4.5 15C4.0875 15 3.73438 14.8531 3.44063 14.5594C3.14688 14.2656 3 13.9125 3 13.5V11.25H4.5V13.5H13.5V11.25H15V13.5C15 13.9125 14.8531 14.2656 14.5594 14.5594C14.2656 14.8531 13.9125 15 13.5 15H4.5Z'
            fill='white'
          />
        </g>
      </mask>
      <g mask='url(#mask0_8126_451)'>
        <rect width='18' height='18' fill='currentColor' />
      </g>
    </svg>
  )
}

export default ImportIcon
