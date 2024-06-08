// import { useSimulateContract, useWriteContract } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core'
import { config } from '../config'
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';


interface SimulateAndWriteArgs {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args: any[];
}

const useSimulateAndWriteContract = () => {

  const simulateAndWrite = async ({ address, abi, functionName, args }: SimulateAndWriteArgs): Promise<any> => {
    try {
      const  simulateData  = await simulateContract(config,{
        address,
        abi,
        functionName,
        args,
      });
      
      if (!simulateData.result) {
 
        throw new Error(`Simulation failed for ${functionName} with args ${args}`);
      }
        const resultHash = await writeContract(config,simulateData.request );
        console.log(`result for ${functionName}`,resultHash)
          return resultHash;
    
    }

      catch (error) {
        throw new Error(`Writing Contract failed for ${functionName} with args ${args}: ${error}`);
      }
    }

  return { simulateAndWrite };
};

export default useSimulateAndWriteContract;
