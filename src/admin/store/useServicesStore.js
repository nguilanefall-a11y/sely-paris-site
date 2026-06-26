import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export const useServicesStore = create(
  persist(
    (set) => ({
      services: [],
      addService: (service) => set((state) => ({
        services: [...state.services, { id: uuidv4(), status: 'scheduled', ...service }]
      })),
      updateService: (id, updated) => set((state) => ({
        services: state.services.map((s) => (s.id === id ? { ...s, ...updated } : s))
      })),
      deleteService: (id) => set((state) => ({
        services: state.services.filter((s) => s.id !== id)
      })),
    }),
    {
      name: 'sely-services',
    }
  )
);
