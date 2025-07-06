'use client'

import { createContext, useContext, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Head from 'next/head'
import { Route, RouteSubmenu } from '../interfaces/route'
import { routes } from '@/config/routes'

interface INavigation {
  routes?: Route[]
  activeRoute?: Route
  activeSubRoute?: RouteSubmenu
}

export const NavigationContext = createContext<INavigation>({})

export function useNavigation() {
  return useContext(NavigationContext)
}

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const memoizedRoutes = useMemo(() => {
    return routes
  }, [routes])

  const activeRoute = useMemo(() => {
    if (!pathname) return

    const splittedPathname = pathname.split('/')

    if (pathname === '/') {
      return routes.find((route) => route.mainPath === '/')
    }

    return routes.find((route) => splittedPathname[1] === route.mainPath)
  }, [pathname, routes])

  const activeSubRoute = useMemo(() => {
    if (!activeRoute || activeRoute.submenus.length === 0) return

    return activeRoute.submenus.find((submenu: RouteSubmenu) => pathname.includes(submenu.link))
  }, [activeRoute, pathname])

  const values = useMemo(() => {
    return {
      routes: memoizedRoutes,
      activeRoute,
      activeSubRoute,
    }
  }, [memoizedRoutes, activeRoute, activeSubRoute])

  const pageTitle = `${process.env.NEXT_PUBLIC_APP_NAME ?? ''} - ${activeSubRoute?.title ?? activeRoute?.title ?? ''}`

  return (
    <NavigationContext.Provider value={values}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {children}
    </NavigationContext.Provider>
  )
}
