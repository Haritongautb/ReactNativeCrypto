import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styled from "styled-components/native";

const LoadingText = styled.Text`
  font-weight: 700;
  font-size: 30px;
  margin-top: 15px;
  text-align: center;
`;

export const Loading = () => {
  return (
    <View>
      <ActivityIndicator size="large" />
      <LoadingText>Loading....</LoadingText>
    </View>
  );
};
