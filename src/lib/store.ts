import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserSettings {
  weatherEnabled: boolean;
  cryptoEnabled: boolean;
  city: string;
  selectedCoins: string[];
  jokesViewed: number;
  lastVisitDate: string;
}

interface SettingsStore extends UserSettings {
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  incrementJokesViewed: () => void;
  resetJokesCount: () => void;
}

const initialState: UserSettings = {
  weatherEnabled: false,
  cryptoEnabled: false,
  city: '',
  selectedCoins: [],
  jokesViewed: 0,
  lastVisitDate: new Date().toDateString(),
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
      resetSettings: () => set(initialState),
      incrementJokesViewed: () =>
        set((state) => ({ jokesViewed: state.jokesViewed + 1 })),
      resetJokesCount: () =>
        set((state) => ({ jokesViewed: 0, lastVisitDate: new Date().toDateString() })),
    }),
    {
      name: 'wagmistuff-settings',
    }
  )
);