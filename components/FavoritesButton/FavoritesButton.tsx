import React from "react";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCrypto } from "@/store";

const FavoritesButtonContainer = styled.View`
  position: absolute;
  top: 10px;
  left: 10px;
`;

const FavoritesBtn = styled(TouchableOpacity)`
  background-color: transparent;
  padding: 10px;
`;

const BadgeContainer = styled.View`
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: red;
  border-radius: 10px;
  padding: 2px 6px;
  min-width: 18px;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;
export const FavoritesButton: React.FC = () => {
  const router = useRouter();
  const { loading, watchlist } = useCrypto();

  if (!loading) {
    console.log(`Users watchlist at header =>>>>`, watchlist);
  }
  return (
    <FavoritesButtonContainer>
      <FavoritesBtn onPress={() => router.push("/favorites")}>
        <MaterialIcons name="star" size={28} color="#fbc02d" />
      </FavoritesBtn>
      {watchlist.length > 0 && (
        <BadgeContainer>
          <BadgeText>{watchlist.length}</BadgeText>
        </BadgeContainer>
      )}
    </FavoritesButtonContainer>
  );
};
