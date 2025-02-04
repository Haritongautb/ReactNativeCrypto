import { create } from "zustand";
import { CryptoService } from "@/services";
export interface CryptoState {
  watchlist: string[];
  loading: boolean;
  setCryptoToWatchlist: (cryptoId: string) => void;
  removeCryptoFromWatchlist: (cryptoId: string) => void;
  getUsersWatchlist: (userId: string) => Promise<void>;
}

export const useCrypto = create<CryptoState>((set) => ({
  watchlist: [],
  loading: true,
  setCryptoToWatchlist: (cryptoId: string) => {
    set((state) => ({
      ...state,
      watchlist: [...state.watchlist, cryptoId],
    }));
  },
  removeCryptoFromWatchlist: (cryptoId: string) => {
    set((state) => ({
      ...state,
      watchlist: state.watchlist.filter((item) => item !== cryptoId),
    }));
  },
  getUsersWatchlist: async (userId: string) => {
    if (!userId) {
      set({ loading: false });
      return;
    }
    set({ loading: true });
    const response = await CryptoService.getUsersWatchlist(userId);
    if (response.success) {
      set((state) => ({
        ...state,
        watchlist: response.data,
        loading: false,
      }));
    } else {
      set((state) => ({
        ...state,
        loading: false,
      }));
    }
  },
}));
