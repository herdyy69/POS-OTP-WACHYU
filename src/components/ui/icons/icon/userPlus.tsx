const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
        id='mask0_8126_2407'
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
          d='M12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10Z'
          stroke='white'
          strokeWidth='1.5'
        />
        <path
          d='M15 13.327C14.0152 13.1071 13.009 12.9974 12 13C7.582 13 4 15.015 4 17.5C4 19.985 4 22 12 22C17.687 22 19.331 20.982 19.807 19.5'
          stroke='white'
          strokeWidth='1.5'
        />
        <path
          d='M18 20C20.2091 20 22 18.2091 22 16C22 13.7909 20.2091 12 18 12C15.7909 12 14 13.7909 14 16C14 18.2091 15.7909 20 18 20Z'
          stroke='white'
          strokeWidth='1.5'
        />
        <path
          d='M18 14.667V17.333M16.667 16H19.333'
          stroke='white'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </mask>
      <g mask='url(#mask0_8126_2407)'>
        <rect width='24' height='24' fill='currentColor' />
      </g>
    </svg>
  )
}

export default UserPlusIcon
