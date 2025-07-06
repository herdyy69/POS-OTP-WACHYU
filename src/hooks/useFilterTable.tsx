'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import { useUpdateParams } from './useUpdateParams'
import { castToNumberOrKeepString } from '@/lib/cast'

const initialValues = {
  page: 1,
  limit: 10,
  sort: '',
  order: '',
  search: undefined,
}

export const useFilterTable = ({
  name,
  filterKeys,
  filterArray,
  defaultValues = initialValues,
  persistPage = false,
}: any) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const setParams = useUpdateParams()

  const getValueFromSearchParams = (key: string, persistDataStructure: boolean = false) => {
    const filterValue = searchParams.getAll(key).map((value: any) => castToNumberOrKeepString(value))

    if (key.includes('search')) {
      return searchParams.get(key)
    }

    if (filterValue.length === 0) {
      return
    }

    return filterValue.length > 1 || persistDataStructure ? filterValue : filterValue[0]
  }

  const params = useMemo(() => {
    if (!router) return

    // Helper function to get value from search params
    const getSearchParamValue = (key: string, asArray: boolean = false) => {
      return getValueFromSearchParams(key, asArray)
    }

    // Initialize the filter objects
    const filterDefault = { ...defaultValues }
    const filterParams: { [key: string]: any } = {}
    const filterValues: { [key: string]: any } = {}

    // Populate filterDefault and filterParams with default values and search params
    Object.keys(defaultValues).forEach((defaultKey) => {
      const key = name ? `${defaultKey}_${name}` : defaultKey
      const value = getSearchParamValue(key)

      // Set default and params
      filterDefault[defaultKey] = value ?? defaultValues[defaultKey]
      filterParams[defaultKey] = value ?? defaultValues[defaultKey]
    })

    // Process filterKeys if provided
    filterKeys?.forEach((defaultKey: any) => {
      const key = name ? `${defaultKey}_${name}` : defaultKey
      const value = getSearchParamValue(key, filterArray?.includes(defaultKey))

      // Set filter values and params
      filterValues[defaultKey] = value
      filterParams[defaultKey] = value
    })

    return { filterParams, filterDefault, filterValues }
  }, [searchParams, filterKeys, defaultValues, name, filterArray])

  const saveFilter = (filterParams: any) => {
    let filters: any = {}

    Object.entries(filterParams).forEach(([defaultKey, value]) => {
      if (filterKeys && !filterKeys.includes(defaultKey)) return

      const key = name ? `${defaultKey}_${name}` : defaultKey
      filters[key] = value
    })

    if (persistPage) {
      filters[name ? `page_${name}` : 'page'] = 1
    }

    setParams(filters)
  }

  const resetFilter = () => {
    const defaultQuery: any = {}

    if (params?.filterDefault) {
      Object.entries(params?.filterDefault).forEach(([key, value]) => {
        if (value && key !== 'page' && key !== 'limit') {
          defaultQuery[key] = value
        }
      })
    }

    // Create a new URLSearchParams instance with the default query
    const newSearchParams = new URLSearchParams()
    Object.entries(defaultQuery).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => newSearchParams.append(key, v.toString()))
      } else if (value !== undefined && value !== null) {
        newSearchParams.set(key, value.toString())
      }
    })

    // Create the new URL with the search params
    const newPathname = `${pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`

    router.push(newPathname)
  }

  return {
    filterValues: params?.filterValues,
    filter: params?.filterParams,
    saveFilter,
    resetFilter,
  }
}
