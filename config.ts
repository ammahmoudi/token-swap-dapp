'use client';

import { http, createStorage, cookieStorage } from 'wagmi'
import { sepolia, bscTestnet, blastSepolia,polygonZkEvmCardona,polygon,polygonMumbai,polygonZkEvmTestnet, polygonZkEvm } from 'wagmi/chains'
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'

const projectId = '-m-token-swap-dapp';

const supportedChains: Chain[] = [sepolia, bscTestnet, blastSepolia, polygonZkEvmCardona, polygon, polygonMumbai, polygonZkEvmTestnet, polygonZkEvm];

export const config = getDefaultConfig({
   appName: 'WalletConnection',
   projectId,
   chains: supportedChains as any,
   ssr: true,
   storage: createStorage({
    storage: cookieStorage,
   }),
  transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {})
 });