import React from "react";
import { CoinsTable } from "@/components/CoinsTable/CoinsTable";
import { MainLayout } from "@/layouts";

const HomeScreen = () => {
  return (
    <MainLayout>
      <CoinsTable />
    </MainLayout>
  );
};

export default HomeScreen;
