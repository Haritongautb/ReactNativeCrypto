import React from "react";
import { TextInput } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import styled from "styled-components/native";
import { Button, Text } from "react-native-paper";

import { PathEnums } from "@/types";
import { User } from "firebase/auth";

import { AuthService } from "@/services";
import { useAuth } from "@/store";
import { IFormProps } from "./form.interface";

const FormContainer = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: #f4f4f4;
`;

const FormHeader = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const TitleText = styled(Text)`
  font-size: 40px;
  font-weight: bold;
  color: #6200ee;
  text-align: center;
`;

const StyledInput = styled(TextInput)`
  margin-bottom: 16px;
  background-color: white;
  font-size: 16px;
`;

const ErrorText = styled(Text)`
  color: red;
`;

const LinkWrapper = styled.View`
  margin-top: 20px;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: #6200ee;
  font-weight: bold;
`;

type Inputs = {
  name: string;
  email: string;
  password: string;
};

export const Form: React.FC<IFormProps> = ({ pathname, title }) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues:
      pathname === PathEnums.LOGIN
        ? { email: "", password: "" }
        : { name: "", email: "", password: "" },
  });

  const { setUser } = useAuth((state) => state);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    switch (pathname) {
      case PathEnums.LOGIN: {
        const { email, password } = data;
        const user: User | null = await AuthService.login(email, password);
        if (!user) {
          return;
        }
        setUser({ user });
        reset();
        router.push("/");
        return;
      }
      case PathEnums.SIGNUP: {
        const { name, email, password } = data;
        const user: User | null = await AuthService.signup(
          name,
          email,
          password
        );
        if (!user) {
          return;
        }
        setUser({ user });
        reset();
        router.push("/login");
        return;
      }
      default:
        return;
    }
  };

  return (
    <FormContainer>
      <FormHeader>
        <TitleText>{title}</TitleText>
      </FormHeader>

      {/* name */}
      {pathname === PathEnums.SIGNUP && (
        <>
          {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Please provide your name",
              minLength: {
                value: 1,
                message: "name cannot be empty",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <StyledInput
                label="Enter your name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                left={<TextInput.Icon icon="account" />}
              />
            )}
          />
        </>
      )}

      {/* email */}
      <>
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Please provide your email address",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Please enter a valid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledInput
              label="Enter your email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              left={<TextInput.Icon icon="email" />}
            />
          )}
        />
      </>

      {/* password */}
      <>
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Please provide your password",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledInput
              label="Enter your password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              left={<TextInput.Icon icon="lock" />}
            />
          )}
        />
      </>

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        {title}
      </Button>

      <LinkWrapper>
        <StyledLink href={pathname === PathEnums.LOGIN ? "/signup" : "/login"}>
          {pathname === PathEnums.LOGIN ? "Sign up" : "Log in"}
        </StyledLink>
      </LinkWrapper>
    </FormContainer>
  );
};
