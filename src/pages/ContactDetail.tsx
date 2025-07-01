
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Trash2, Calendar, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Contact } from "@/pages/Dashboard";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from props or API
const mockContacts: Contact[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D5c8c50B7C3a5d2A',
    name: 'Alice Johnson',
    tags: ['Developer', 'Trusted Partner'],
    notes: 'Lead developer for DeFi protocol. Very responsive and professional.',
    role: 'Smart Contract Developer',
    trustLevel: 9,
    lastInteraction: new Date('2024-05-28'),
    interactionCount: 15
  },
  {
    id: '2',
    address: '0x8ba1f109551bD432803012645Hac136c9331q8c4c',
    name: 'Bob Smith',
    tags: ['Client', 'High Value'],
    notes: 'Regular client for NFT marketplace transactions.',
    role: 'NFT Collector',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-30'),
    interactionCount: 23
  },
  {
    id: '3',
    address: '0x9f3hj109551bD432803012645Hac136c9331q8s9d',
    tags: ['Flagged', 'Potential Scam'],
    notes: 'Multiple failed transactions and suspicious behavior.',
    role: 'Unknown',
    trustLevel: 2,
    lastInteraction: new Date('2024-05-20'),
    interactionCount: 3
  }
];

const mockTransactions = [
  {
    id: '1',
    hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    type: 'Sent',
    amount: '0.5 ETH',
    date: new Date('2024-05-28'),
    status: 'Confirmed'
  },
  {
    id: '2',
    hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    type: 'Received',
    amount: '1.2 ETH',
    date: new Date('2024-05-25'),
    status: 'Confirmed'
  },
  {
    id: '3',
    hash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
    type: 'Sent',
    amount: '0.8 ETH',
    date: new Date('2024-05-20'),
    status: 'Confirmed'
  }
];

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const contact = id === 'new' ? null : mockContacts.find(c => c.id === id);
  const isNewContact = id === 'new';

  const [editableContact, setEditableContact] = useState(contact || {
    id: '',
    address: '',
    name: '',
    tags: [],
    notes: '',
    role: '',
    trustLevel: 5,
    interactionCount: 0
  });

  const [tagInput, setTagInput] = useState('');

  if (!isNewContact && !contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Contact Not Found</h1>
              <Button onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(editableContact.address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Contact saved",
      description: isNewContact ? "New contact created successfully" : "Contact updated successfully",
    });
    if (isNewContact) {
      navigate('/dashboard');
    }
  };

  const handleDelete = () => {
    // In a real app, this would delete from backend
    toast({
      title: "Contact deleted",
      description: "Contact has been removed from your list",
    });
    navigate('/dashboard');
  };

  const addTag = () => {
    if (tagInput.trim() && !editableContact.tags.includes(tagInput.trim())) {
      setEditableContact(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditableContact(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTrustLevelColor = (level: number) => {
    if (level >= 8) return 'bg-green-500';
    if (level >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          {!isNewContact && (
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Input
                      value={editableContact.name || ''}
                      onChange={(e) => setEditableContact(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Contact Name"
                      className="text-2xl font-bold border-none p-0 h-auto bg-transparent shadow-none focus-visible:ring-0"
                    />
                    <Input
                      value={editableContact.role}
                      onChange={(e) => setEditableContact(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Role"
                      className="text-slate-600 border-none p-0 h-auto bg-transparent shadow-none focus-visible:ring-0 mt-2"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Address */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Wallet Address</h3>
                  <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
                    <Input
                      value={editableContact.address}
                      onChange={(e) => setEditableContact(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="0x..."
                      className="font-mono text-sm border-none bg-transparent shadow-none focus-visible:ring-0 p-0"
                    />
                    <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editableContact.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add tag"
                      className="text-sm"
                    />
                    <Button onClick={addTag} size="sm">Add</Button>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Notes</h3>
                  <Textarea
                    value={editableContact.notes}
                    onChange={(e) => setEditableContact(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes about this contact..."
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <Button onClick={handleSave} className="w-full">
                  {isNewContact ? 'Create Contact' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Transactions List */}
            {!isNewContact && (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${tx.type === 'Sent' ? 'text-red-600' : 'text-green-600'}`}>
                              {tx.type}
                            </span>
                            <span className="text-sm text-slate-600">{tx.amount}</span>
                          </div>
                          <code className="text-xs text-slate-500">
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                          </code>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">{formatDate(tx.date)}</div>
                          <div className="text-xs text-green-600">{tx.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trust Level */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Trust Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-slate-800 mb-2">
                    {editableContact.trustLevel}/10
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                    <div 
                      className={`h-2 rounded-full ${getTrustLevelColor(editableContact.trustLevel)}`}
                      style={{ width: `${editableContact.trustLevel * 10}%` }}
                    />
                  </div>
                </div>
                <Slider
                  value={[editableContact.trustLevel]}
                  onValueChange={(value) => setEditableContact(prev => ({ ...prev, trustLevel: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Transaction Stats */}
            {!isNewContact && (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">Total Transactions</span>
                      </div>
                      <span className="font-semibold">{editableContact.interactionCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">Last Transaction</span>
                      </div>
                      <span className="text-sm">{formatDate(contact?.lastInteraction)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
