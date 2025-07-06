import { Route } from '../interfaces/route'
import { Icons } from '@/components/ui/icons'

export const routes: Route[] = [
  {
    id: 1,
    menu: 'Main',
    link: '/',
    mainPath: '/',
    title: 'Dasbor',
    icon: <Icons.Home />,
    isCollapse: false,
    isShow: true,
    submenus: [],
  },
  {
    id: 4,
    link: '/products',
    mainPath: 'products',
    title: 'Produk',
    icon: <Icons.PackageIcon />,
    isCollapse: false,
    isShow: true,
    submenus: [],
  },
  {
    id: 5,
    link: '/stores',
    mainPath: 'stores',
    title: 'Toko',
    icon: <Icons.StoreIcon />,
    isCollapse: false,
    isShow: true,
    submenus: [],
  },
  {
    id: 6,
    link: '/sales-orders',
    mainPath: 'sales-orders',
    title: 'Penjualan',
    icon: <Icons.RequestIcon />,
    isCollapse: false,
    isShow: true,
    submenus: [],
  },
]
