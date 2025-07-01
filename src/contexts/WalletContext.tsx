
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletState {
  isConnected: boolean;
  address: string;
  alias: string;
}

interface WalletContextType {
  wallet: WalletState;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: '',
    alias: ''
  });

  const connect = () => {
    // Mock wallet connection
    setWallet({
      isConnected: true,
      address: '0x742d35Cc6634C0532925a3b8D5c8c50B7C3a5d2A',
      alias: 'alice.eth'
    });
  };

  const disconnect = () => {
    setWallet({
      isConnected: false,
      address: '',
      alias: ''
    });
  };

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};
