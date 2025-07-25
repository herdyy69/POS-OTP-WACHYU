const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={props.className}
    >
      <mask
        id='mask0_8126_2246'
        style={{
          maskType: 'alpha',
        }}
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='24'
        height='24'
      >
        <path
          d='M2 12.204C2 9.915 2 8.771 2.52 7.823C3.038 6.874 3.987 6.286 5.884 5.108L7.884 3.867C9.889 2.622 10.892 2 12 2C13.108 2 14.11 2.622 16.116 3.867L18.116 5.108C20.013 6.286 20.962 6.874 21.481 7.823C22 8.772 22 9.915 22 12.203V13.725C22 17.625 22 19.576 20.828 20.788C19.656 22 17.771 22 14 22H10C6.229 22 4.343 22 3.172 20.788C2.001 19.576 2 17.626 2 13.725V12.204Z'
          stroke='white'
          strokeWidth='1.5'
        />
        <path d='M9 16C9.85 16.63 10.885 17 12 17C13.115 17 14.15 16.63 15 16' fill='currentColor' />
        <path
          d='M9 16C9.85 16.63 10.885 17 12 17C13.115 17 14.15 16.63 15 16'
          stroke='white'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </mask>
      <g mask='url(#mask0_8126_2246)'>
        <rect width='24' height='24' fill='currentColor' />
      </g>
    </svg>
  )
}

export default HomeIcon
