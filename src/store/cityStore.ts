import { create } from "zustand";

type Lot = {
  type: string | null;
};

interface CityState {
  lots: Lot[];
  money: number;
  population: number;
  happiness: number;
  energy: number;
  water: number;
  buildLot: (index: number, buildingType: string) => void;
}

export const useCityStore = create<CityState>((set) => ({
  lots: Array(64).fill({ type: null }),
  money: 10000,
  population: 0,
  happiness: 100,
  energy: 100,
  water: 100,
  buildLot: (index, buildingType) =>
    set((state) => {
      const updatedLots = [...state.lots];
      updatedLots[index] = { type: buildingType };
      return { lots: updatedLots };
    }),
}));
