import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export const useClientsStore = create(
  persist(
    (set) => ({
      clients: [],
      addClient: (client) => set((state) => ({
        clients: [...state.clients, { id: uuidv4(), createdAt: new Date().toISOString(), ...client }]
      })),
      updateClient: (id, updatedClient) => set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? { ...c, ...updatedClient } : c))
      })),
      deleteClient: (id) => set((state) => ({
        clients: state.clients.filter((c) => c.id !== id)
      })),
    }),
    {
      name: 'sely-clients',
    }
  )
);
