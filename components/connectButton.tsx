"use client";

import { useEffect, useRef } from "react";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { emojiAvatarForAddress } from "../emojiAvatarForAddress";
import { Button, ButtonGroup } from "@nextui-org/react";

export const ConnectBtn = () => {
  const { isConnecting, address, isConnected, chain } = useAccount();
  const { color: backgroundColor, emoji } = emojiAvatarForAddress(
    address ?? ""
  );

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  if (!isConnected) {
    return (
      <Button
        onClick={async () => {
          // Disconnecting wallet first because sometimes when is connected but the user is not connected
          if (isConnected) {
            disconnect();
          }
          openConnectModal?.();
        }}
        disabled={isConnecting}
        color="primary"  variant="flat"
      >
        { isConnecting ? 'Connecting...' : 'Connect your wallet' }
      </Button>
    );
  }

  if (isConnected && !chain) {
    return (
      <Button onClick={openChainModal} color="primary"  variant="flat">
        Wrong network
      </Button>
    );
  }

  return (
    <div>
          <ButtonGroup>

      <Button
        onClick={async () => openAccountModal?.()}
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
        startContent={<>{emoji}</>}
>

        Account
      </Button>
      <Button className="btn" onClick={openChainModal} color="primary"  variant="flat">
        Switch Networks
      </Button>
      </ButtonGroup>
    </div>
  );
};
