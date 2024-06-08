// components/TokenSwapForm.tsx
import React, { useState } from 'react';
import { Button, Input, Stack, Text } from '@chakra-ui/react';
import { handleSwap } from '../utils/handleSwap'; 


const TokenSwapForm: React.FC= () => {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    setLoading(true);
    setError('');

    try {
      const response = await handleSwap(`0x${fromToken}`, toToken, amount, receiverAddress);

      console.log(response)

    } catch (err:any) {
      setError(`Error during swap: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Input
          placeholder="From Token (e.g., ETH)"
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          name="fromToken"
        />
        <Input
          placeholder="To Token (e.g., DAI)"
          value={toToken}
          onChange={(e) => setToToken(e.target.value)}
          name="toToken"
        />
        <Input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          name="amount"
        />
        <Input
          placeholder="Receiver Address"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          name="receiverAddress"
        />
        <Button type="submit" isLoading={loading}>
          Swap Tokens
        </Button>
        {error && <Text color="red">{error}</Text>}
      </Stack>
    </form>
  );
};

export default TokenSwapForm;
