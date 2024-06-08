import { ethers } from "ethers";

export const toWeiCustom = (rawBalance: string | number, decimal: number) => {
    // const wei = Web3.utils.toWei(rawBalance, decimal);
    const wei = ethers.parseUnits(rawBalance.toString(), decimal);
    return wei;
  };