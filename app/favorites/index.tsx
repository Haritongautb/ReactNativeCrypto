import React from "react";
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import { useQueries } from "@tanstack/react-query";
import { useAuth, useCrypto } from "@/store";
import { CryptoService } from "@/services";
import { useRouter } from "expo-router";
import { formatNumberWithCommas } from "@/utils";
import { MainLayout } from "@/layouts";

const TableContainer = styled.View`
  max-height: 500px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 3;
  margin: 10px;
`;

const TableRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
  padding: 10px 0;
  align-items: center;
`;

const TableCell = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  flex: 1;
  text-align: center;
`;

const TableHeader = styled(TableCell)`
  font-weight: bold;
  font-size: 18px;
  color: #6200ee;
`;

const RemoveButton = styled(TouchableOpacity)`
  background-color: #d32f2f;
  padding: 5px 10px;
  border-radius: 5px;
`;

const RemoveButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const PercentageText = styled.Text<{ isPositive: boolean }>`
  color: ${(props: { isPositive: boolean }) =>
    props.isPositive ? "#4CAF50" : "#D32F2F"};
  font-weight: bold;
  font-size: 16px;
`;

const EmptyBanner = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  background-color: #ffebee;
`;

const EmptyBannerText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #d32f2f;
  text-align: center;
`;

const FavoritesScreen = () => {
  const { user } = useAuth();
  const router = useRouter();

  const { watchlist, removeCryptoFromWatchlist } = useCrypto();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const queries = useQueries({
    queries: watchlist.map((cryptoId) => ({
      queryKey: ["coin", cryptoId],
      queryFn: () => CryptoService.getCryptoById(cryptoId),
      select: CryptoService.getCryptoByIdResponseHandler,
      enabled: !!user,
      refetchInterval: 60000,
    })),
  });

  React.useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const isLoading = queries.some((query) => query.isLoading);

  const handleRemoveCryptoIdFromWatchlist = async (cryptoId: string) => {
    if (!user) return;

    const response = await CryptoService.removeCryptoFromWatchlist(
      user.uid,
      cryptoId
    );

    if (response.success) {
      removeCryptoFromWatchlist(cryptoId);
      router.reload();
    }
  };

  const refetchAll = async () => {
    setIsRefreshing(true);
    await Promise.all(queries.map((query) => query.refetch && query.refetch()));
    setIsRefreshing(false);
  };

  return (
    <MainLayout>
      <TableContainer>
        <TableRow>
          <TableHeader>Coin</TableHeader>
          <TableHeader>Price</TableHeader>
          <TableHeader>24h %</TableHeader>
          <TableHeader>Action</TableHeader>
        </TableRow>

        {watchlist.length === 0 ? (
          <EmptyBanner>
            <EmptyBannerText>😢 You have no favorite crypto</EmptyBannerText>
          </EmptyBanner>
        ) : isLoading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <FlatList
            data={queries
              .filter((query: any) => !query.isError && query.data)
              .map((query: any) => query.data.fullCoin)}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refetchAll}
              />
            }
            renderItem={({ item }) => {
              const priceChange = parseFloat(item.priceChange1d);
              const isPositive = priceChange >= 0;
              const sign = isPositive ? "▲" : "▼";

              return (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/full_crypto/[cryptoId]",
                      params: { cryptoId: item.id },
                    })
                  }
                >
                  <TableRow key={item.id}>
                    <TableCell>{item.coinName}</TableCell>
                    <TableCell>
                      ${formatNumberWithCommas(item.price.toFixed(2))}
                    </TableCell>
                    <PercentageText isPositive={isPositive}>
                      {sign}{" "}
                      {isPositive ? priceChange : `-${Math.abs(priceChange)}`}%
                    </PercentageText>
                    <TableCell>
                      <RemoveButton
                        onPress={() =>
                          handleRemoveCryptoIdFromWatchlist(item.id)
                        }
                      >
                        <RemoveButtonText>Remove</RemoveButtonText>
                      </RemoveButton>
                    </TableCell>
                  </TableRow>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        )}
      </TableContainer>
    </MainLayout>
  );
};

export default FavoritesScreen;
