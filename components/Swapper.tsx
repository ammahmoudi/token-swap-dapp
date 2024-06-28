import { useState } from "react";
import { useAccount, useBlock } from "wagmi";
import { ethers } from "ethers";
import {
	UNISWAP_POLYGON_V2FACTORY,
	UNISWAP_POLYGON_V2ROUTER02,
} from "../data/uniswapAddresses";
import IUniswapV2Factory from "@uniswap/v2-core/build/IUniswapV2Factory.json";
import IUniswapV2Router02 from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";
import { erc20Abi } from "viem";
import useSimulateAndWriteContract from "../hooks/simulateAndWriteContract";
import useSimulateAndReadContract from "../hooks/simulateAndReadContract";

import { useToast } from "@chakra-ui/react";
import {
	Input,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Card,
	Spacer,
	useDisclosure,
} from "@nextui-org/react";
import { toWeiCustom } from "@/utils/toWeiCustom";

const Swapper = () => {
	const { address: recipientAddress, isConnected } = useAccount();
	const [tokenInAddress, setTokenInAddress] = useState<`0x${string}`>(
		"0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
	);
	const [tokenOutAddress, setTokenOutAddress] = useState<`0x${string}`>(
		"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
	);
	const [amountIn, setAmountIn] = useState("0.1");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [approveHash, setApproveHash] = useState<any>();
	const [swapHash, setSwapHash] = useState<any>();
	const [swapResult, setSwapResult] = useState("");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { simulateAndWrite } = useSimulateAndWriteContract();
	const { simulateAndRead } = useSimulateAndReadContract();
    

	const toast = useToast();

	const calcDeadlineWagmiV2 = async () => {
		try {
			const { data: lastBlock } = await useBlock({
				blockTag: "latest",
			});

			const lastTime = lastBlock?.timestamp || 0;
			if (lastTime === 0) {
				toast({
					title: "Error in calculating deadline",
					description:
						"Unable to calculate deadline. Last block timestamp is 0",
					status: "error",
					duration: 9000,
					isClosable: true,
				});

				throw new Error("Unable to calculate deadline");
			}

			const _deadline = lastTime + BigInt(100000);
			const deadline = toWeiCustom(_deadline.toString(), 1);
			return deadline;
		} catch (error) {
			toast({
				title: "Error in calculating deadline",
				description:
					(error as Error).message || "Unable to calculate deadline.",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
			throw new Error("Unable to calculate deadline");
		}
	};

	function ensure0xPrefix(input: string): string {
		if (input.startsWith("0x")) {
			return input as `0x${string}`; // Already has the correct prefix
		} else {
			return `0x${input}`; // Add the '0x' prefix
		}
	}

	const handleSwap = async () => {
		setIsSubmitting(true);
		try {
			const pairAddress = await simulateAndRead({
				address: UNISWAP_POLYGON_V2FACTORY,
				abi: IUniswapV2Factory.abi,
				functionName: "getPair",
				args: [tokenInAddress, tokenOutAddress],
			});
			if (pairAddress == "0x0000000000000000000000000000000000000000") {
				throw new Error("Pair not found between tokens");
			}
			toast({
				title: "Pair found Successfully",
				description: pairAddress,
				status: "success",
				duration: 9000,
				isClosable: true,
			});

			const approveHash = await simulateAndWrite({
				address: tokenInAddress,
				abi: erc20Abi,
				functionName: "approve",
				args: [
					UNISWAP_POLYGON_V2ROUTER02,
					ethers.parseUnits(amountIn, "ether"),
				],
			});

			setApproveHash(approveHash);

			const path = [tokenInAddress, tokenOutAddress];

			const amountsOut = await simulateAndRead({
				address: UNISWAP_POLYGON_V2ROUTER02,
				abi: IUniswapV2Router02.abi,
				functionName: "getAmountsOut",
				args: [ethers.parseUnits(amountIn, "ether"), path],
			});
			const amountOutMin = amountsOut[amountsOut.length - 1];
			toast({
				title: "AmountsOut Calculated",
				description: amountsOut,
				status: "success",
				duration: 9000,
				isClosable: true,
			});

			const deadline = await calcDeadlineWagmiV2();
			toast({
				title: "Deadline Calculated",
				description: deadline,
				status: "success",
				duration: 9000,
				isClosable: true,
			});

			const swapHash = await simulateAndWrite({
				address: UNISWAP_POLYGON_V2ROUTER02,
				abi: IUniswapV2Router02.abi,
				functionName: "swapExactTokensForTokens",
				args: [
					ethers.parseUnits(amountIn, "ether"),
					amountOutMin,
					path,
					recipientAddress,
					deadline,
				],
			});
			setSwapHash(swapHash);
			toast({
				title: "Swap Successful!",
				description: swapHash,
				status: "success",
				duration: 9000,
				isClosable: true,
			});

			setSwapResult("Swap Successful!");
			onOpen();
		} catch (error) {
			toast({
				title: "Error in Swapping",
				description:
					(error as Error).message || "Swap failed. Please try again.",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
			console.error("Swap failed", error);
			console.log(swapHash);
			setSwapResult("Swap Failed!");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-wrap md:flex-nowrap gap-4 ">
			<div className="p-8 space-y-2 rounded-md max-w-lg  justify-center items-center bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
				<Input
					disabled={!isConnected}
					label="Token In Address"
					placeholder="Enter Token In Address"
					value={tokenInAddress}
					onChange={(e) =>
						setTokenInAddress(ensure0xPrefix(e.target.value) as `0x${string}`)
					}
				/>
				<Input
					disabled={!isConnected}
					fullWidth
					label="Token Out Address"
					placeholder="Enter Token Out Address"
					value={tokenOutAddress}
					onChange={(e) =>
						setTokenOutAddress(ensure0xPrefix(e.target.value) as `0x${string}`)
					}
				/>
				<Input
					disabled={!isConnected}
					fullWidth
					label="Amount In"
					placeholder="Enter Amount In"
					value={amountIn}
					onChange={(e) => setAmountIn(e.target.value)}
				/>
				<Spacer y={1} />
				<Button
					color="primary"
					variant={isConnected ? "solid" : "light"}
					fullWidth
					onClick={handleSwap}
					isLoading={isSubmitting}
					disabled={!isConnected}
				>
					{isConnected
						? isSubmitting
							? "Swapping..."
							: "Swap Tokens"
						: "Please Connect your wallet"}
				</Button>

				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalContent>
						<ModalHeader>Swap Result</ModalHeader>
						<ModalBody>
							<p>{swapResult}</p>
							<p>ApproveHash: {approveHash}</p>
							<p>SwapHash: {swapHash}</p>
						</ModalBody>
						<ModalFooter>
							<Button onClick={onClose}>Close</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</div>
		</div>
	);
};

export default Swapper;
