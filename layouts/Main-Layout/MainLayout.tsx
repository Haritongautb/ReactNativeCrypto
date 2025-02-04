import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/partials";
import { IMainLayoutProps } from "./main-layout.interface";

export const MainLayout: React.FC<IMainLayoutProps> = ({ children }) => {
  return (
    <SafeAreaView>
      <Header />
      {children}
    </SafeAreaView>
  );
};
