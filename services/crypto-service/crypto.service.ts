import { IFullCoin } from "@/components";
import { db } from "@/firebase";
import axios from "axios";
import {
  doc,
  arrayUnion,
  setDoc,
  arrayRemove,
  updateDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";
import Toast from "react-native-toast-message";

export class CryptoService {
  static async addCryptoToWatchlist(userId: string, cryptoId: string) {
    try {
      const userRef = doc(db, "UsersWatchListCrypto", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, { watchlist: [cryptoId] });
      } else {
        await updateDoc(userRef, {
          watchlist: arrayUnion(cryptoId),
        });
      }
      Toast.show({
        type: "success",
        text1: "Adding crypto",
        text2: `A crypto currency ${cryptoId} has been added to your favorites`,
        position: "top",
        topOffset: 50,
      });
      return {
        success: true,
        message: `Successfully added ${cryptoId} to your favorites`,
      };
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Adding crypto",
        text2:
          error.message ||
          `An error occurred while adding ${cryptoId} to your favorites`,
        position: "top",
        topOffset: 50,
      });
      return {
        success: false,
        message:
          error.message ||
          `An error occurred while adding ${cryptoId} to your favorites`,
      };
    }
  }
  static async removeCryptoFromWatchlist(userId: string, cryptoId: string) {
    try {
      const userRef = doc(db, "UsersWatchListCrypto", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return {
          success: false,
          message: "User watchlist does not exist",
        };
      }

      const data = userDoc.data();
      if (!data.watchlist || !data.watchlist.includes(cryptoId)) {
        return {
          success: false,
          message: "Crypto not found watchlist",
        };
      }
      await updateDoc(userRef, {
        watchlist: arrayRemove(cryptoId),
      });

      const updatedDoc = await getDoc(userRef);
      const updatedData = updatedDoc.data();

      if (!updatedData?.watchlist || updatedData?.watchlist.length === 0) {
        await updateDoc(userRef, {
          watchlist: deleteField(),
        });
      }

      Toast.show({
        type: "success",
        text1: "Deleting crypto",
        text2: `Removed ${cryptoId} from your favorites`,
        position: "top",
        topOffset: 50,
      });
      return {
        success: true,
        message: `Successfully removed ${cryptoId} from your favorites`,
      };
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Deleting crypto",
        text2:
          error.message ||
          `An error occurred while removing ${cryptoId} from your favorites`,
        position: "top",
        topOffset: 50,
      });
      return {
        success: false,
        message:
          error.message ||
          `An error occurred while removing ${cryptoId} from your favorites`,
      };
    }
  }
  static async getUsersWatchlist(userId: string) {
    try {
      const userRef = doc(db, "UsersWatchListCrypto", userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        return { success: false, message: "No watchlist found", data: [] };
      }

      const data = userDoc.data();

      return { success: true, data: data.watchlist || [] };
    } catch (error: any) {
      return {
        success: false,
        message: "An error occurred while fetching favorites",
        data: [],
      };
    }
  }

  static async getCrypts(page: number) {
    try {
      const response = await axios.get(
        process.env.EXPO_PUBLIC_CRYPTO_API_URL as string,
        {
          params: {
            page,
            limit: 50,
          },
          headers: {
            "X-API-KEY": process.env.EXPO_PUBLIC_CRYPTO_API_KEY,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }

      throw new Error("Failed to fetch data: Unexpected status code");
    } catch (err: unknown) {
      let errorMessage = "An error occurred while fetching data";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      return { error: true, message: errorMessage };
    }
  }

  static responseHandler(response: any) {
    if (response.error) {
      return response.message;
    }

    const coins = response.result.map((item: any) => ({
      id: item.id,
      coinName: item.name,
      price: item.price,
      iconUrl: item.icon,
      coinSymbol: item.symbol,
    }));

    return {
      coins,
      meta: response.meta,
    };
  }

  static async getCryptoById(cryptoId: string) {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_CRYPTO_API_URL}/${cryptoId}`,
        {
          params: {
            currency: "USD",
          },
          headers: {
            "X-API-KEY": process.env.EXPO_PUBLIC_CRYPTO_API_KEY,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        message: `Unexpected status code: ${response.status}`,
      };
    } catch (error: any) {
      let errorMessage = "An error occurred while fetching crypto data.";

      if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${
          error.response.data?.message || "Unknown error"
        }`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = `Request error: ${error.message}`;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  static getCryptoByIdResponseHandler(response: any) {
    if (!response.success) {
      return response.message;
    }
    let coinsData = {} as IFullCoin;
    coinsData.id = response.data.id;
    coinsData.iconUrl = response.data.icon;
    coinsData.coinName = response.data.name;
    coinsData.price = response.data.price;
    coinsData.coinSymbol = response.data.symbol;
    coinsData.priceChange1h = response.data.priceChange1h.toString();
    coinsData.priceChange1d = response.data.priceChange1d.toString();
    coinsData.priceChange1w = response.data.priceChange1w.toString();
    coinsData.totalSupply = response.data.totalSupply;
    coinsData.volume = response.data.volume;

    return {
      fullCoin: coinsData,
    };
  }
}
