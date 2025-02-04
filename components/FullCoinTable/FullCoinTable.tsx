import React from "react";
import { IFullCoinTableProps } from "./full-coin-table.interface";
import styled from "styled-components/native";
import { formatNumberWithCommas } from "@/utils";
import { ToggleButton } from "../ToggleButton/ToggleButton";

const TableContainer = styled.View`
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
`;

const TableHeader = styled(TableCell)`
  font-weight: bold;
  font-size: 18px;
  color: #6200ee;
`;

const CryptoHeader = styled.View`
  align-items: center;
  margin-bottom: 15px;
`;

const CryptoIcon = styled.Image`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
`;

const CryptoName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #6200ee;
`;

const PercentageText = styled.Text<{ isPositive: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props: { isPositive: boolean }) =>
    props.isPositive ? "#4CAF50" : "#D32F2F"};
`;

const formatPercentageChange = (value: string | number) => {
  const num = parseFloat(value.toString());
  if (isNaN(num)) return "-";

  const isPositive = num >= 0;
  const arrow = isPositive ? "▲" : "▼";

  return (
    <PercentageText isPositive={isPositive}>
      {arrow} {num}%
    </PercentageText>
  );
};

export const FullCoinTable: React.FC<IFullCoinTableProps> = ({
  priceChange1h,
  priceChange1d,
  priceChange1w,
  totalSupply,
  volume,
  coinName,
  price,
  iconUrl,
  coinSymbol,
  id,
}) => {
  return (
    <TableContainer>
      <CryptoHeader>
        <CryptoIcon source={{ uri: iconUrl }} />
        <CryptoName>
          {coinName} ({coinSymbol})
        </CryptoName>
        <TableCell>💰 Price: ${price.toFixed(2)}</TableCell>
        <ToggleButton id={id} />
      </CryptoHeader>

      <TableRow>
        <TableHeader>Change (1h)</TableHeader>
        {formatPercentageChange(priceChange1h)}
      </TableRow>
      <TableRow>
        <TableHeader>Change (1d)</TableHeader>
        {formatPercentageChange(priceChange1d)}
      </TableRow>
      <TableRow>
        <TableHeader>Change (1w)</TableHeader>
        {formatPercentageChange(priceChange1w)}
      </TableRow>
      <TableRow>
        <TableHeader>Total Supply</TableHeader>
        <TableCell>{formatNumberWithCommas(totalSupply)}</TableCell>
      </TableRow>
      <TableRow>
        <TableHeader>Trading Volume</TableHeader>
        <TableCell>${formatNumberWithCommas(volume)}</TableCell>
      </TableRow>
    </TableContainer>
  );
};
