import { formatNumberWithCommas } from "@/utils";
import React from "react";
import styled from "styled-components/native";
import { ICoinRowProps } from "./coin-row.interface";

const TableRow = styled.View<{ isEven: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 5px;
  background-color: ${(props: { isEven: boolean }) =>
    props.isEven ? "#f9f9f9" : "white"};
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const TableCell = styled.View<{ width: number }>`
  width: ${(props: { width: number }) => props.width}px;
  justify-content: center;
  align-items: center;
  border-right-width: 1px;
  border-right-color: #ddd;
  padding: 10px;
`;

const LastTableCell = styled(TableCell)`
  border-right-width: 0;
`;

const TextCell = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-align: center;
  flex-wrap: wrap; /* Перенос текста внутри ячейки */
`;

const IndexText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #6200ee;
`;

const Icon = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 5px;
`;

export const CoinRow: React.FC<ICoinRowProps> = ({
  coinName,
  price,
  iconUrl,
  coinSymbol,
  index,
}) => {
  return (
    <TableRow isEven={index % 2 === 0}>
      <TableCell width={50}>
        <IndexText>{index + 1}.</IndexText>
      </TableCell>
      <TableCell width={110}>
        <TextCell>{coinName}</TextCell>
      </TableCell>
      <TableCell width={80}>
        <TextCell>{coinSymbol}</TextCell>
      </TableCell>
      <TableCell width={90}>
        <TextCell>${formatNumberWithCommas(Number(price).toFixed(2))}</TextCell>
      </TableCell>
      <LastTableCell width={60}>
        <Icon source={{ uri: iconUrl }} />
      </LastTableCell>
    </TableRow>
  );
};
