import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (data) => set({
        user: data.user,
        token: data.token,
        refreshToken: data.refreshToken,
        isAuthenticated: true
      }),

      logout: () => set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false
      }),

      setLoading: (loading) => set({ isLoading: loading }),

     /* The `updateUser` function in the `useAuthStore` zustand store is a method that allows updating
     the user object with new data. */
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      }))
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;