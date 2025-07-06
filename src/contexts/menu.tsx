'use client'

import { Route } from '@/interfaces/route'
import { createContext, useContext, useMemo, useState } from 'react'

export const MenuContext = createContext<any>(null)

export function useMenu() {
  return useContext(MenuContext)
}

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeCollapseRoute, setActiveCollapseRoute] = useState<Route | null>()
  const [isSidebarCollapse, setIsSidebarCollapse] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  const handleCollapseRoute = (route: Route) => {
    if (activeCollapseRoute?.id === route.id) {
      setActiveCollapseRoute(null)
    } else {
      setActiveCollapseRoute(route)
    }
  }

  const handleCollapseSidebar = () => {
    setIsSidebarCollapse((prevValue) => !prevValue)
  }

  const handleMobileMenu = (menu: boolean) => {
    setIsMobileMenuOpen(menu)
  }

  const values = useMemo(() => {
    return {
      activeCollapseRoute,
      isSidebarCollapse,
      isMobileMenuOpen,
      handleCollapseRoute,
      handleCollapseSidebar,
      handleMobileMenu,
    }
  }, [
    activeCollapseRoute,
    isSidebarCollapse,
    isMobileMenuOpen,
    handleCollapseRoute,
    handleCollapseSidebar,
    handleMobileMenu,
  ])

  return <MenuContext.Provider value={values}>{children}</MenuContext.Provider>
}
