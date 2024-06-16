import { useState } from 'react';
import { useAccount, useBlock, useBlockNumber } from 'wagmi';
import { ethers } from 'ethers';
import {  UNISWAP_POLYGON_V2FACTORY, UNISWAP_POLYGON_V2ROUTER02 } from '../data/uniswapAddresses';

import IUniswapV2Factory from '@uniswap/v2-core/build/IUniswapV2Factory.json'
import IUniswapV2Router02 from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { erc20Abi } from 'viem';
import useSimulateAndWriteContract from '../hooks/simulateAndWriteContract';
import useSimulateAndReadContract from '../hooks/simulateAndReadContract';



import {
    Box,
    Button,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Center,
    useToast,
    Toast
} from '@chakra-ui/react';
import { toWeiCustom } from '@/utils/toWeiCustom';


const Swapper = () => {
    const { address: recipientAddress } = useAccount();
    const [tokenInAddress, setTokenInAddress] = useState<`0x${string}`>('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270');
    const [tokenOutAddress, setTokenOutAddress] = useState<`0x${string}`>('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174');
    const [amountIn, setAmountIn] = useState('0.1');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [approveHash, setApproveHash] = useState<any>();
    const [swapHash, setSwapHash] = useState<any>();
    const [swapResult, setSwapResult] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { simulateAndWrite } = useSimulateAndWriteContract();
    const { simulateAndRead } = useSimulateAndReadContract();

    const toast =useToast()

const calcDeadlineWagmiV2 = async () => {
    try {
      // Get the latest block from Wagmi v2
        const{data:lastBlock} = await  useBlock({
        blockTag: 'latest'
      })

      // Extract the timestamp from the last block
      const lastTime = lastBlock?.timestamp || 0;
      if (lastTime === 0) {
        toast({
            title: 'Error in calculating deadline',
            description: "Unable to calculate deadline. Last block timestamp is 0",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        
        throw new Error("Unable to calculate deadline");
      }
  
      // Add 100000 seconds to the last timestamp
      const _deadline = lastTime + BigInt(100000);
  
      // Convert the deadline to Wei (adjust the multiplier as needed)
      const deadline = toWeiCustom(_deadline.toString(), 1); // Adjust the multiplier if necessary
  
      return deadline;
    } catch (error) {
        toast({
            title: 'Error in calculating deadline',
            description: (error as Error).message || "Unable to calculate deadline.",
            status: 'error',
            duration: 9000,
            isClosable: true,
        })
        throw new Error("Unable to calculate deadline");
    }
  };
    function ensure0xPrefix(input: string): string {
        if (input.startsWith('0x')) {
            return input as `0x${string}`; // Already has the correct prefix
        } else {
            return `0x${input}`; // Add the '0x' prefix
        }
    }

    // Set the deadline for the swap to be 20 minutes from the current time
    // const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const handleSwap = async () => {
        setIsSubmitting(true);
        try {
            const pairAddress = await simulateAndRead({
                address: UNISWAP_POLYGON_V2FACTORY,
                abi: IUniswapV2Factory.abi,
                functionName: 'getPair',
                args: [tokenInAddress, tokenOutAddress],
            });
            if (pairAddress == "0x0000000000000000000000000000000000000000") {
                throw new Error("Pair not found between tokens");
              }
              toast({
                title: 'Pair found Successfuly',
                description: pairAddress,
                status: 'success',
                duration: 9000,
                isClosable: true,
              })

            const approveHash = await simulateAndWrite({
                address: tokenInAddress,
                abi: erc20Abi,
                functionName: 'approve',
                args: [UNISWAP_POLYGON_V2ROUTER02, ethers.parseUnits(amountIn, 'ether')],
            });

           
            setApproveHash(approveHash);

            
    // Define the path for the swap
    const path = [tokenInAddress, tokenOutAddress];

    const amountsOut = await simulateAndRead({
        address: UNISWAP_POLYGON_V2ROUTER02,
        abi: IUniswapV2Router02.abi,
        functionName: 'getAmountsOut',
        args: [ethers.parseUnits(amountIn, 'ether'), path],
    });
    const amountOutMin = amountsOut[amountsOut.length - 1];
    toast({
        title: 'AmountsOut Calculated',
        description: amountsOut,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

    const deadline = await calcDeadlineWagmiV2();
    toast({
        title: 'Dadline Calculated',
        description: deadline,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

            const swapHash = await simulateAndWrite({
                address: UNISWAP_POLYGON_V2ROUTER02,
                abi: IUniswapV2Router02.abi,
                functionName: 'swapExactTokensForTokens',
                args: [ethers.parseUnits(amountIn, 'ether'), amountOutMin, path, recipientAddress, deadline],
            });
            setSwapHash(swapHash);
            toast({
                title: 'Swap Successful!',
                description: swapHash,
                status: 'success',
                duration: 9000,
                isClosable: true,
              })

            setSwapResult('Swap Successful!');
            onOpen();

        } catch (error) {
                toast({
                    title: 'Error in Sawping ',
                    description: (error as Error).message || "Swap failed. Please try again.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                  })
            console.error('Swap failed', error);
            console.log(swapHash)
            setSwapResult('Swap Failed!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Center h="100vh" bg="white">
            <Box p={4} boxShadow="md" rounded="md" bg="white">
                <Input
                    placeholder="Token In Address"
                    value={tokenInAddress}
                    onChange={(e) => setTokenInAddress(ensure0xPrefix(e.target.value) as `0x${string}`)}
                />
                <Input
                    mt={4}
                    placeholder="Token Out Address"
                    value={tokenOutAddress}
                    onChange={(e) => setTokenOutAddress(ensure0xPrefix(e.target.value) as `0x${string}`)}
                />
                <Input
                    mt={4}
                    placeholder="Amount In"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                />
                <Button
                    mt={4}
                    onClick={handleSwap}
                    isLoading={isSubmitting}
                    loadingText="Swapping..."
                >
                    Swap Tokens
                </Button>

                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Swap Result</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {swapResult}
                            ApproveHash: {approveHash}
                            SwapHash: {swapHash}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </Center>
    );
};

export default Swapper;
