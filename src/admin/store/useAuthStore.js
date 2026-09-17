import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (password) => {
        const validPasswords = ['sely2024', 'selyprive', 'amprive2024', 'sely', 'admin'];
        if (validPasswords.includes(password.trim().toLowerCase())) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'sely-auth-storage',
    }
  )
);
