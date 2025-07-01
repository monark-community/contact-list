
import React from 'react';
import { Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';

const Header = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TrustList
              </h1>
              <p className="text-sm text-slate-600">Your Web3 Contact Manager</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
