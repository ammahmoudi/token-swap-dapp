'use client'

import React, { useState } from 'react';
import { useSwitchChain } from 'wagmi';
import { Select, Box, Text } from '@chakra-ui/react';

const NetworkSwitcher: React.FC = () => {
  const { chains, switchChain, error } = useSwitchChain();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (chainId: number) => {
    try {
      setIsSwitching(true);
      await switchChain({ chainId });
    } catch (err: any) {
      console.error('Failed to switch network:', err.message);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <Box>
      {error && <Text color="red.500">Failed to switch network: {error.message}</Text>}
      <Select
        placeholder="Select network"
        onChange={(event) => {
          const chainId = parseInt(event.target.value, 10);
          handleSwitch(chainId);
        }}
        isDisabled={isSwitching}
      >
        {chains.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default NetworkSwitcher;
