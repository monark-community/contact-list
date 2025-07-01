
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Trash2, Info, Plus, Search, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Contact } from "@/pages/Dashboard";
import { useToast } from "@/hooks/use-toast";

// Enhanced mock data with more contacts
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
    hash: '0x3c4d5e6f7890abcdef123456789012345678901234',
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

  const [showTagSelect, setShowTagSelect] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Available tags for selection
  const allAvailableTags = [
    'Client', 'Developer', 'Designer', 'DeFi Protocol', 'DAO Member', 
    'Flagged', 'High Value', 'NFT Creator', 'Partner', 'Potential Scam',
    'Regular Client', 'Trusted Partner', 'Unverified', 'Validator', 'VIP',
    'Exchange', 'Whale', 'Bot', 'Institutional', 'Retail', 'Mining Pool',
    'Smart Contract', 'Multisig', 'Cold Storage', 'Hot Wallet'
  ].filter(tag => !editableContact.tags.includes(tag));

  const filteredTags = allAvailableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  // Calculate suggested trust level based on transaction count and other factors
  const calculateSuggestedTrustLevel = () => {
    if (isNewContact) return 5;
    
    const baseScore = Math.min(editableContact.interactionCount * 0.5, 5);
    const hasPositiveTags = editableContact.tags.some(tag => 
      ['Trusted Partner', 'Developer', 'Client', 'High Value'].includes(tag)
    );
    const hasNegativeTags = editableContact.tags.some(tag => 
      ['Flagged', 'Potential Scam', 'Unverified'].includes(tag)
    );
    
    let suggested = baseScore;
    if (hasPositiveTags) suggested += 2;
    if (hasNegativeTags) suggested -= 3;
    
    return Math.max(1, Math.min(10, Math.round(suggested)));
  };

  const suggestedTrustLevel = calculateSuggestedTrustLevel();

  if (!isNewContact && !contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    setHasUnsavedChanges(false);
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

  const addTag = (tag: string) => {
    if (!editableContact.tags.includes(tag)) {
      setEditableContact(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setHasUnsavedChanges(true);
    }
    setShowTagSelect(false);
    setTagSearch('');
  };

  const removeTag = (tagToRemove: string) => {
    setEditableContact(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setHasUnsavedChanges(true);
  };

  const handleManageTags = () => {
    if (hasUnsavedChanges) {
      setShowLeaveWarning(true);
    } else {
      navigate('/tags');
    }
  };

  const confirmLeave = () => {
    setShowLeaveWarning(false);
    navigate('/tags');
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
    if (level <= 3) {
      const ratio = (level - 1) / 2;
      const red = 220;
      const green = Math.round(60 + (40 * ratio));
      return `rgb(${red}, ${green}, 0)`;
    } else if (level <= 5) {
      const ratio = (level - 3) / 2;
      const red = Math.round(220 - (40 * ratio));
      const green = Math.round(100 + (80 * ratio));
      return `rgb(${red}, ${green}, 0)`;
    } else {
      const ratio = (level - 5) / 5;
      const red = Math.round(180 * (1 - ratio));
      const green = 180;
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  const getTrustLevelBgColor = (level: number) => {
    const color = getTrustLevelColor(level);
    return color.replace('rgb(', 'rgba(').replace(')', ', 0.1)');
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            {!isNewContact && (
              <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Contact
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    {isNewContact ? 'Create New Contact' : 'Edit Contact'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Contact Name *
                        </label>
                        <Input
                          value={editableContact.name || ''}
                          onChange={(e) => {
                            setEditableContact(prev => ({ ...prev, name: e.target.value }));
                            setHasUnsavedChanges(true);
                          }}
                          placeholder="Contact Name"
                          className="text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Role
                        </label>
                        <Input
                          value={editableContact.role}
                          onChange={(e) => {
                            setEditableContact(prev => ({ ...prev, role: e.target.value }));
                            setHasUnsavedChanges(true);
                          }}
                          placeholder="Role"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Wallet Address *
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={editableContact.address}
                          onChange={(e) => {
                            setEditableContact(prev => ({ ...prev, address: e.target.value }));
                            setHasUnsavedChanges(true);
                          }}
                          placeholder="0x..."
                          className="font-mono"
                        />
                        <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Tags</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleManageTags}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Manage Tags
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editableContact.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="w-fit bg-blue-50 text-blue-700 border-blue-200">
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <div className="relative">
                          <Badge
                            variant="outline"
                            className="w-fit cursor-pointer bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100"
                            onClick={() => setShowTagSelect(!showTagSelect)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add tag
                          </Badge>
                          {showTagSelect && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-10 min-w-[300px] max-h-[300px] overflow-hidden">
                              <div className="p-2 border-b">
                                <div className="relative">
                                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                  <Input
                                    placeholder="Search tags..."
                                    value={tagSearch}
                                    onChange={(e) => setTagSearch(e.target.value)}
                                    className="pl-8"
                                  />
                                </div>
                              </div>
                              <div className="overflow-y-auto max-h-[200px]">
                                {filteredTags.length > 0 ? (
                                  filteredTags.map(tag => (
                                    <div
                                      key={tag}
                                      onClick={() => addTag(tag)}
                                      className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm border-b last:border-b-0"
                                    >
                                      <Badge variant="outline" className="w-fit bg-blue-50 text-blue-700 border-blue-200">
                                        {tag}
                                      </Badge>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-slate-500 text-sm">
                                    No tags found
                                  </div>
                                )}
                              </div>
                              <div className="p-2 border-t">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleManageTags}
                                  className="w-full"
                                >
                                  <Settings className="h-3 w-3 mr-1" />
                                  Manage Tags
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Notes
                      </label>
                      <Textarea
                        value={editableContact.notes}
                        onChange={(e) => {
                          setEditableContact(prev => ({ ...prev, notes: e.target.value }));
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="Add notes about this contact..."
                        className="resize-none"
                        rows={3}
                      />
                    </div>

                    <Button onClick={handleSave} className="w-full">
                      {isNewContact ? 'Create Contact' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Trust Level Cards */}
            <div className="space-y-6">
              {/* Trust Level */}
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Trust Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div 
                      className="text-3xl font-bold mb-2"
                      style={{ color: getTrustLevelColor(editableContact.trustLevel) }}
                    >
                      {editableContact.trustLevel}/10
                    </div>
                  </div>
                  
                  {/* Merged slider and colored bar */}
                  <div className="relative">
                    <div 
                      className="w-full rounded-full h-6 mb-4 relative overflow-hidden"
                      style={{ backgroundColor: getTrustLevelBgColor(editableContact.trustLevel) }}
                    >
                      <div 
                        className="h-6 rounded-full transition-all duration-200"
                        style={{ 
                          backgroundColor: getTrustLevelColor(editableContact.trustLevel),
                          width: `${editableContact.trustLevel * 10}%` 
                        }}
                      />
                      <div className="absolute inset-0">
                        <Slider
                          value={[editableContact.trustLevel]}
                          onValueChange={(value) => setEditableContact(prev => ({ ...prev, trustLevel: value[0] }))}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full h-6 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:shadow-md [&_[role=slider]]:w-6 [&_[role=slider]]:h-6"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Trust Level with Detailed Metrics */}
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Suggested Trust Level</CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-slate-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Our platform calculates trust scores based on transaction history, 
                          contact tags, and network reputation. This is our recommended 
                          trust level for this contact.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div 
                      className="text-2xl font-bold mb-2"
                      style={{ color: getTrustLevelColor(suggestedTrustLevel) }}
                    >
                      {suggestedTrustLevel}/10
                    </div>
                    <div 
                      className="w-full rounded-full h-2 mb-3"
                      style={{ backgroundColor: getTrustLevelBgColor(suggestedTrustLevel) }}
                    >
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: getTrustLevelColor(suggestedTrustLevel),
                          width: `${suggestedTrustLevel * 10}%` 
                        }}
                      />
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditableContact(prev => ({ ...prev, trustLevel: suggestedTrustLevel }))}
                      className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Apply Suggestion
                    </Button>
                  </div>

                  {/* Detailed Metrics */}
                  <div className="space-y-3 mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-slate-700">Detailed Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Total Transactions</span>
                        <span className="font-medium">{editableContact.interactionCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-600">Positive Tags</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Tags that indicate trustworthiness: Trusted Partner, Developer, Client, High Value
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <span className="font-medium text-green-600">
                          {editableContact.tags.filter(tag => 
                            ['Trusted Partner', 'Developer', 'Client', 'High Value'].includes(tag)
                          ).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-600">Risk Flags</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Tags that indicate potential risks: Flagged, Potential Scam, Unverified
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <span className="font-medium text-red-600">
                          {editableContact.tags.filter(tag => 
                            ['Flagged', 'Potential Scam', 'Unverified'].includes(tag)
                          ).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Last Transaction</span>
                        <span className="text-slate-500 text-xs">{formatDate(contact?.lastInteraction)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Leave Warning Dialog */}
        <Dialog open={showLeaveWarning} onOpenChange={setShowLeaveWarning}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unsaved Changes</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLeaveWarning(false)}>
                Stay on Page
              </Button>
              <Button variant="destructive" onClick={confirmLeave}>
                Leave Anyway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default ContactDetail;
