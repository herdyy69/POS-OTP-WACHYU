import { Auth } from '../../_server/schemas/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStore {
  user: Auth | null
  setUser: (v: Auth | null) => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null })
      },
    }),
    {
      name: 'auth-store',
    },
  ),
)
