import { useLocalSearchParams, useRouter } from "expo-router";
import { MainLayout } from "@/layouts";
import { useQuery } from "@tanstack/react-query";
import { CryptoService } from "@/services";
import { FullCoinTable, Loading } from "@/components";
import styled from "styled-components/native";
import { useAuth } from "@/store";
import React from "react";

const ErrorContainer = styled.View`
  background-color: #ffebee;
  padding: 15px;
  border-radius: 10px;
  margin: 20px;
  align-items: center;
`;

const ErrorText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #d32f2f;
`;
const FullCryptoScreen = () => {
  const { user } = useAuth.getState();
  const router = useRouter();

  const { cryptoId } = useLocalSearchParams<{ cryptoId: string }>();

  React.useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["coin", cryptoId],
    queryFn: () => CryptoService.getCryptoById(cryptoId),
    select: CryptoService.getCryptoByIdResponseHandler,
    refetchInterval: 60000,
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  let render;

  if (isFetching || isLoading) {
    render = <Loading />;
  } else if (!data || typeof data === "string") {
    render = (
      <ErrorContainer>
        <ErrorText>{data || "Error: No data available"}</ErrorText>
      </ErrorContainer>
    );
  } else {
    render = <FullCoinTable {...data.fullCoin} />;
  }

  return <MainLayout>{render}</MainLayout>;
};

export default FullCryptoScreen;
