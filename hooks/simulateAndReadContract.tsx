import { simulateContract, readContract } from '@wagmi/core'; // Import the necessary functions
import { config } from '../config'; // Make sure you have the correct configuration

interface SimulateAndReadArgs {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args: any[];
}

const useSimulateAndReadContract = () => {
  const simulateAndRead = async ({ address, abi, functionName, args }: SimulateAndReadArgs): Promise<any> => {
    try {
      // Simulate the contract call
      const simulateData = await simulateContract(config, {
        address,
        abi,
        functionName,
        args,
      });

      if (!simulateData.result) {
        throw new Error(`Simulation failed for ${functionName} with args ${args}`);
      }

      // Read data from the blockchain
      const result = await readContract(config, {
        address,
        abi,
        functionName,
        args,
      });

      console.log(`Result for ${functionName}`, result); // Log the result (you can handle it differently)

      return result;
    } catch (error) {
      throw new Error(`Reading Contract failed for ${functionName} with args ${args}: ${error}`);
    }
  };

  return { simulateAndRead };
};

export default useSimulateAndReadContract;
