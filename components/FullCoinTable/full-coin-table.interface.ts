import { ICoinRowProps } from "../CoinRow/coin-row.interface";

export interface IFullCoin extends Omit<ICoinRowProps, "index"> {
  priceChange1h: string;
  priceChange1d: string;
  priceChange1w: string;
  totalSupply: number;
  volume: number;
}

export interface IFullCoinTableProps extends IFullCoin {}
