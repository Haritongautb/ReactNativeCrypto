import { logout, useAuth } from "@/store";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Button, Text } from "react-native-paper";
import styled from "styled-components/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { FavoritesButton, Loading } from "@/components";

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #6200ee;
`;

const ButtonLink = styled(Link)`
  padding: 12px 20px;
  background-color: #6200ee;
  color: white;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  margin-right: 10px;
`;

const ButtonsBlock = styled.View`
  flex-direction: row;
`;

const UserInfo = styled.View`
  flex-direction: column;
  align-items: center;
`;

const UserDetails = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

const UserName = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-left: 8px;
`;

const UserEmailContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const UserEmail = styled(Text)`
  font-size: 14px;
  color: #666;
  margin-left: 5px;
`;

const LogoutButton = styled(Button)`
  flex-direction: row;
  align-items: center;
  background-color: #d32f2f;
  padding: 5px 10px;
  border-radius: 5px;
  min-width: 100px;
`;

export const Header = () => {
  const { user, loading } = useAuth((state) => state);
  const router = useRouter();
  return (
    <HeaderContainer>
      {user && <FavoritesButton />}

      <HeaderTitle onPress={() => router.push("/")}>Crypto Price</HeaderTitle>
      {loading ? (
        <Loading />
      ) : user ? (
        <UserInfo>
          <UserDetails>
            <FontAwesome name="user" size={20} color="#333" />
            <UserName>{user.displayName}</UserName>
          </UserDetails>
          <UserEmailContainer>
            <MaterialIcons name="email" size={16} color="#666" />
            <UserEmail>{user.email}</UserEmail>
          </UserEmailContainer>
          <LogoutButton mode="contained" onPress={logout}>
            <MaterialIcons name="logout" size={16} color="white" />
            &nbsp;Log out
          </LogoutButton>
        </UserInfo>
      ) : (
        <ButtonsBlock>
          <ButtonLink href="/signup">Sign up</ButtonLink>
          <ButtonLink href="/login">Log in</ButtonLink>
        </ButtonsBlock>
      )}
    </HeaderContainer>
  );
};
