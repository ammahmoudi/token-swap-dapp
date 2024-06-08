import { useSimulateContract, useWriteContract } from 'wagmi'

import { ethers } from 'ethers';
import UniswapRouterABI from '../abi/IUniswapV2Router02.json'
import { UNISWAP_ROUTER_ADDRESS } from '../data/uniswapAddresses';
import { erc20Abi } from 'viem'

export const handleSwap = async (
  tokenInAddress: `0x${string}`,
  tokenOutAddress: string,
  amountIn: string,
  recipientAddress: string
)=> {
  console.log(tokenInAddress)
  console.log(tokenOutAddress)
  console.log(amountIn)
  console.log(recipientAddress)

  // Convert the amount to the appropriate unit
  const amountInWei = ethers.parseUnits(amountIn, 'ether')

  // Prepare the approval transaction
  const { data: approveConfig } = useSimulateContract({
    address: tokenInAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [UNISWAP_ROUTER_ADDRESS, amountInWei],
    
  })

  // Execute the approval transaction
  const { writeContract } = useWriteContract()
  writeContract(approveConfig!.request)

  // Define the path for the swap
  const path = [tokenInAddress, tokenOutAddress]

  // Set the minimum amount of tokens to receive, which you can calculate based on slippage
  const amountOutMin = ethers.parseUnits('0', 'ether')

  // Set the deadline for the swap to be 20 minutes from the current time
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20

  // Prepare the swap transaction
  const { data: swapConfig } = useSimulateContract({
    address: UNISWAP_ROUTER_ADDRESS,
    abi: UniswapRouterABI.abi,
    functionName: 'swapExactTokensForTokens',
    args: [amountInWei, amountOutMin, path, recipientAddress, deadline],
    
  })

  // Execute the swap transaction
  writeContract(swapConfig!.request)

  return { approveConfig, swapConfig }
}
