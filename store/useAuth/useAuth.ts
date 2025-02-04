import { auth } from "@/firebase";
import { AuthService } from "@/services";
import { onAuthStateChanged, User } from "firebase/auth";
import { create } from "zustand";
import { useCrypto } from "../useCrypto/useCrypto";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (data: { user?: User | null; loading?: boolean }) => void;
  loadUser: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (data) => {
    set((state) => ({
      ...state,
      ...data,
    }));
  },
  loadUser: () => {
    const currentUser = auth.currentUser;
    set({ user: currentUser });
  },
}));

export const initializeAuth = () => {
  const { setUser } = useAuth.getState();
  const { getUsersWatchlist } = useCrypto.getState();
  onAuthStateChanged(auth, (user) => {
    setUser({ user, loading: false });
    if (user) {
      getUsersWatchlist(user.uid);
    }
  });
};

export const logout = () => {
  const { setUser } = useAuth.getState();
  AuthService.logout();
  setUser({ user: null });
};
