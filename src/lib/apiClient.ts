import { tracer } from '@/lib/tracer'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  paramsSerializer: {
    indexes: null,
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config

    if (originalConfig.url !== '/auth/login' && error.response) {
      if (
        (error.response.status === 401 || error.response.status === 500) &&
        error.response.data?.message === 'token has invalid claims: token is expired' &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            refresh_token: localStorage.getItem('refresh_token'),
          })

          const { access_token, refresh_token } = data?.data

          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)

          return apiClient(originalConfig)
        } catch (err) {
          tracer.error('Failed to refresh the token', err as Error)
          localStorage.removeItem('auth-store')
          localStorage.removeItem('persist:root')
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')

          if (window.location.pathname.includes('/')) {
            window.location.replace('/auth/login')
          }

          return Promise.reject(err)
        }
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
