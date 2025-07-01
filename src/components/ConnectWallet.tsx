
import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock wallet connection state - in a real app this would come from a Web3 provider
interface WalletState {
  isConnected: boolean;
  address: string;
  alias: string;
}

const ConnectWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: '',
    alias: ''
  });

  const handleConnect = () => {
    // Mock wallet connection - in real app this would trigger actual wallet connection
    setWallet({
      isConnected: true,
      address: '0x742d35Cc6634C0532925a3b8D5c8c50B7C3a5d2A',
      alias: 'alice.eth'
    });
  };

  const handleDisconnect = () => {
    setWallet({
      isConnected: false,
      address: '',
      alias: ''
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (wallet.isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleDisconnect}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${wallet.address}`} />
            <AvatarFallback>
              {wallet.alias.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-800">
              {wallet.alias}
            </span>
            <span className="text-xs text-slate-500">
              {truncateAddress(wallet.address)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} className="flex items-center space-x-2">
      <Wallet className="h-4 w-4" />
      <span>Connect Wallet</span>
    </Button>
  );
};

export default ConnectWallet;
