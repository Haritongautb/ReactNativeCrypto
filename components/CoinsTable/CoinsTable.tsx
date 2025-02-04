import React from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { CoinRow } from "../CoinRow/CoinRow";
import { useQuery } from "@tanstack/react-query";

import { CryptoService } from "@/services";
import { Loading } from "../Loading/Loading";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const TableContainer = styled.SafeAreaView`
  border-width: 2px;
  border-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.View`
  flex-direction: row;
  background-color: #f5f5f5;
  padding: 10px;
  border-bottom-width: 2px;
  border-bottom-color: #ddd;
`;

const HeaderText = styled.Text<{ width: number }>`
  flex: 1;
  max-width: ${(props: { width: number }) => props.width}px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  border-right-width: 1px;
  border-right-color: #ddd;
  padding: 5px;
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-top-width: 2px;
  border-top-color: #ddd;
`;

const PaginationButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
  background-color: #6200ee;
  padding: 10px 15px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  opacity: ${(props: { disabled: boolean }) => (props.disabled ? 0.5 : 1)};
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
`;

const ScrollContainer = styled.View`
  max-height: 400px;
  width: auto;
`;

const LastHeaderText = styled(HeaderText)`
  border-right-width: 0;
`;

export const CoinsTable = () => {
  let render;
  const [page, setPage] = React.useState<number>(1);
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["coins", page],
    queryFn: () => CryptoService.getCrypts(page),
    select: CryptoService.responseHandler,
    refetchInterval: 60000,
  });

  if (isLoading || isFetching) {
    render = <Loading />;
  } else {
    render = (
      <>
        <TableContainer>
          <TableHeader>
            <HeaderText width={50}>#</HeaderText>
            <HeaderText width={110}>Coin Name</HeaderText>
            <HeaderText width={80}>Symbol</HeaderText>
            <HeaderText width={90}>Price (USD)</HeaderText>
            <LastHeaderText width={60}>Icon</LastHeaderText>
          </TableHeader>

          <ScrollContainer>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={isLoading || isFetching}
                  onRefresh={async () => await refetch()}
                />
              }
              data={data.coins}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/full_crypto/[cryptoId]",
                      params: { cryptoId: item.id },
                    })
                  }
                >
                  <CoinRow
                    coinName={item.coinName}
                    price={item.price}
                    iconUrl={item.iconUrl}
                    coinSymbol={item.coinSymbol}
                    index={index}
                    key={item.id}
                    id={item.id}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </ScrollContainer>

          <PaginationContainer>
            <PaginationButton
              disabled={page === 1}
              onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              <MaterialIcons name="navigate-before" size={24} color="white" />
              <ButtonText>Back</ButtonText>
            </PaginationButton>
            <HeaderText>Page {page}</HeaderText>
            <PaginationButton
              disabled={!data.meta.hasNextPage}
              onPress={() =>
                setPage((prev) => {
                  if (prev + 1 > data.meta.pageCount) {
                    return prev;
                  } else {
                    return prev + 1;
                  }
                })
              }
            >
              <ButtonText>Next</ButtonText>
              <MaterialIcons name="navigate-next" size={24} color="white" />
            </PaginationButton>
          </PaginationContainer>
        </TableContainer>
      </>
    );
  }
  return <>{render}</>;
};
