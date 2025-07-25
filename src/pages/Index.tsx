
import React, { useEffect } from 'react';
import { Shield, Users, Tag, Zap, Eye, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useWallet } from "@/contexts/WalletContext";

const features = [
  {
    icon: Users,
    title: "Organize Your Web3 Network",
    description: "Create and manage a comprehensive directory of wallet addresses with custom labels, notes, and categories."
  },
  {
    icon: Tag,
    title: "Smart Tagging System",
    description: "Tag addresses as 'Trusted Partner', 'Client', 'Developer', or create custom tags that fit your workflow."
  },
  {
    icon: Shield,
    title: "Trust Level Scoring",
    description: "Assign trust levels from 1-10 to help you quickly identify reliable contacts and potential risks."
  },
  {
    icon: Zap,
    title: "Interaction Tracking",
    description: "Keep track of your transaction history and interaction frequency with each contact."
  },
  {
    icon: Eye,
    title: "Advanced Filtering",
    description: "Search and filter your contacts by name, address, tags, trust level, or interaction history."
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your contact data is stored securely and privately. You control who sees what information."
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { wallet, connect } = useWallet();

  useEffect(() => {
    if (wallet.isConnected) {
      navigate('/dashboard');
    }
  }, [wallet.isConnected, navigate]);

  const handleConnectWallet = () => {
    connect();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Your Web3 Contact Manager
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Build and maintain trust relationships in the decentralized world. 
              Organize wallet addresses, track interactions, and manage your Web3 professional network.
            </p>
            <div className="flex justify-center">
              <Button size="lg" onClick={handleConnectWallet} className="text-lg px-8 py-3">
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
          <div className="w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
          <div className="w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Everything you need to manage Web3 relationships
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From individual traders to DAOs, TrustList helps you build and maintain 
            professional relationships in the decentralized ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to organize your Web3 network?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Web3 professionals who trust TrustList to manage their connections.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={handleConnectWallet}
              className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-blue-50"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    TrustList
                  </h3>
                </div>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Your comprehensive Web3 contact manager. Build trust, track relationships, 
                and organize your decentralized network with confidence.
              </p>
              <p className="text-sm text-slate-500">
                © 2024 TrustList. Built for the decentralized future.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Contact Management</li>
                <li>Trust Scoring</li>
                <li>Smart Tagging</li>
                <li>Transaction History</li>
                <li>Advanced Filtering</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Documentation</li>
                <li>Security</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-500">
              Secure, private, and built for Web3 professionals worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
