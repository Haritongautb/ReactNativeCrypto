import { auth } from "@/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";

export class AuthService {
  private static readonly errorMessages: Record<string, string> = {
    "auth/invalid-credential": "Invalid email or password. Please try again.",
    "auth/user-not-found": "Invalid email or password. Please try again.",
    "auth/wrong-password": "Invalid email or password. Please try again.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests":
      "Too many failed attempts. Please wait and try again later.",
  };

  static async login(email: string, password: string) {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      if (!user) {
        return null;
      }

      return user;
    } catch (error: any) {
      const errorCode: string = error.code as string;
      let errorMessage =
        this.errorMessages[errorCode] ||
        "Something went wrong. Please try again.";

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password. Please try again.";
      }
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: errorMessage,
        autoHide: false,
        position: "top",
        topOffset: 50,
      });
      return null;
    }
  }

  static async signup(name: string, email: string, password: string) {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user) {
        Toast.show({
          type: "error",
          text1: "Signup Error",
          text2: "Failed to create account. Please try again.",
          autoHide: false,
          position: "top",
          topOffset: 50,
        });
        return null;
      }
      await updateProfile(user, { displayName: name });

      const userRef = doc(db, "UsersWatchListCrypto", user.uid);
      setDoc(userRef, { watchlist: [] });
      return user;
    } catch (error: any) {
      const errorCode: string = error.code as string;
      const errorMessage =
        this.errorMessages[errorCode] ||
        "Something went wrong. Please try again.";
      Toast.show({
        type: "error",
        text1: "Signup Error",
        text2: errorMessage,
        autoHide: false,
        position: "top",
        topOffset: 50,
      });
      return null;
    }
  }

  static async logout() {
    try {
      signOut(auth);
      await AsyncStorage.clear();
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }
}
