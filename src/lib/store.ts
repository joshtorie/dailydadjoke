import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserSettings {
  weatherEnabled: boolean;
  cryptoEnabled: boolean;
  city: string;
  selectedCoins: string[];
  jokesRemaining: number;
  lastResetDate: string;
}

interface SettingsStore extends UserSettings {
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  decrementJokes: () => void;
  resetJokesIfNewDay: () => void;
}

const initialState: UserSettings = {
  weatherEnabled: false,
  cryptoEnabled: false,
  city: '',
  selectedCoins: [],
  jokesRemaining: 10,
  lastResetDate: new Date().toDateString(),
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
      resetSettings: () => set(initialState),
      decrementJokes: () =>
        set((state) => ({ jokesRemaining: Math.max(0, state.jokesRemaining - 1) })),
      resetJokesIfNewDay: () =>
        set((state) => {
          const today = new Date().toDateString();
          if (today !== state.lastResetDate) {
            return {
              ...state,
              jokesRemaining: 10,
              lastResetDate: today,
            };
          }
          return state;
        }),
    }),
    {
      name: 'wagmistuff-settings',
    }
  )
);