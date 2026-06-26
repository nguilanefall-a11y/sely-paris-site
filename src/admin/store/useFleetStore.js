import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export const useFleetStore = create(
  persist(
    (set) => ({
      drivers: [],
      vehicles: [],
      addDriver: (driver) => set((state) => ({
        drivers: [...state.drivers, { id: uuidv4(), ...driver }]
      })),
      updateDriver: (id, updated) => set((state) => ({
        drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...updated } : d))
      })),
      deleteDriver: (id) => set((state) => ({
        drivers: state.drivers.filter((d) => d.id !== id)
      })),
      
      addVehicle: (vehicle) => set((state) => ({
        vehicles: [...state.vehicles, { id: uuidv4(), ...vehicle }]
      })),
      updateVehicle: (id, updated) => set((state) => ({
        vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updated } : v))
      })),
      deleteVehicle: (id) => set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id)
      })),
    }),
    {
      name: 'sely-fleet',
    }
  )
);
