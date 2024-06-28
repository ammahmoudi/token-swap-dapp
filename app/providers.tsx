"use client";

import { WagmiProvider, cookieToInitialState } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";

import { config } from "../config";
import { ChakraProvider } from "@chakra-ui/react";
import { useToast, ToastProvider } from "@chakra-ui/react";
import { createStandaloneToast } from '@chakra-ui/react'
const { ToastContainer, toast } = createStandaloneToast()

const queryClient = new QueryClient();

type Props = {
	children: React.ReactNode;
	cookie?: string | null;
};

export default function Providers({ children, cookie }: Props) {
	const initialState = cookieToInitialState(config, cookie);
	return (
		<WagmiProvider config={config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<NextUIProvider>
					{children}
          <ToastContainer />

					</NextUIProvider>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
