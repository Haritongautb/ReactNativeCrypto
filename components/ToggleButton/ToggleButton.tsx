import { CryptoService } from "@/services";
import { useAuth, useCrypto } from "@/store";
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const WatchingButton = styled(TouchableOpacity)<{ isWatching: boolean }>`
  background-color: ${(props: { isWatching: boolean }) =>
    props.isWatching ? "#D32F2F" : "#4CAF50"};
  padding: 10px 15px;
  border-radius: 5px;
  margin-top: 10px;
`;

const WatchingButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const ToggleButton: React.FC<{ id: string }> = ({ id }) => {
  const { user } = useAuth.getState();
  const { watchlist, removeCryptoFromWatchlist, setCryptoToWatchlist } =
    useCrypto.getState();

  const [isWatching, setIsWatching] = React.useState(() =>
    watchlist.includes(id)
  );

  const handleToggleWatchlist = async () => {
    if (!user) {
      return;
    }

    if (isWatching) {
      const response = await CryptoService.removeCryptoFromWatchlist(
        user.uid,
        id
      );
      if (response.success) {
        removeCryptoFromWatchlist(id);
        setIsWatching(false);
      }
    } else {
      const response = await CryptoService.addCryptoToWatchlist(user.uid, id);
      if (response.success) {
        setCryptoToWatchlist(id);
        setIsWatching(true);
      }
    }
  };

  React.useEffect(() => {
    setIsWatching(watchlist.includes(id));
  }, [watchlist]);

  return (
    <WatchingButton isWatching={isWatching} onPress={handleToggleWatchlist}>
      <WatchingButtonText>
        {isWatching ? "Remove from Watching" : "Add to Watching"}
      </WatchingButtonText>
    </WatchingButton>
  );
};
