const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
        id='mask0_8126_2426'
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
          d='M9 10C11.2091 10 13 8.20914 13 6C13 3.79086 11.2091 2 9 2C6.79086 2 5 3.79086 5 6C5 8.20914 6.79086 10 9 10Z'
          stroke='white'
          strokeWidth='1.5'
        />
        <path
          d='M15 9C15.7956 9 16.5587 8.68393 17.1213 8.12132C17.6839 7.55871 18 6.79565 18 6C18 5.20435 17.6839 4.44129 17.1213 3.87868C16.5587 3.31607 15.7956 3 15 3'
          stroke='white'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
        <path
          d='M9 21C12.866 21 16 19.2091 16 17C16 14.7909 12.866 13 9 13C5.13401 13 2 14.7909 2 17C2 19.2091 5.13401 21 9 21Z'
          stroke='white'
          strokeWidth='1.5'
        />
        <path
          d='M18 14C19.754 14.385 21 15.359 21 16.5C21 17.53 19.986 18.423 18.5 18.87'
          stroke='white'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </mask>
      <g mask='url(#mask0_8126_2426)'>
        <rect width='24' height='24' fill='currentColor' />
      </g>
    </svg>
  )
}

export default UsersIcon
