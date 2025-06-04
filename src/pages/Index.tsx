
import React, { useState, useMemo } from 'react';
import { Search, Plus, Wallet, Tag, Filter, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactCard from "@/components/ContactCard";
import AddContactDialog from "@/components/AddContactDialog";
import FilterPanel from "@/components/FilterPanel";

export interface Contact {
  id: string;
  address: string;
  name?: string;
  tags: string[];
  notes: string;
  role: string;
  trustLevel: number;
  lastInteraction?: Date;
  interactionCount: number;
}

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

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [trustLevelFilter, setTrustLevelFilter] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = 
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => contact.tags.includes(tag));
      
      const matchesTrustLevel = trustLevelFilter === null || 
        contact.trustLevel >= trustLevelFilter;

      return matchesSearch && matchesTags && matchesTrustLevel;
    });
  }, [contacts, searchTerm, selectedTags, trustLevelFilter]);

  const handleAddContact = (newContact: Omit<Contact, 'id'>) => {
    const contact: Contact = {
      ...newContact,
      id: Date.now().toString()
    };
    setContacts(prev => [...prev, contact]);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TrustList
                </h1>
                <p className="text-sm text-slate-600">Your Web3 Contact Manager</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="hidden sm:flex"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Trusted Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contacts.filter(c => c.trustLevel >= 8).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Active Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allTags.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contacts.reduce((sum, c) => sum + c.interactionCount, 0)}
              </div>
              <p className="text-xs opacity-75">Interactions</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="lg:w-80">
              <FilterPanel
                allTags={allTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                trustLevelFilter={trustLevelFilter}
                onTrustLevelChange={setTrustLevelFilter}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search contacts by name, address, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-slate-200"
              />
            </div>

            {/* Active Filters */}
            {(selectedTags.length > 0 || trustLevelFilter !== null) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                      onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag} ×
                    </Badge>
                  ))}
                  {trustLevelFilter !== null && (
                    <Badge 
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                      onClick={() => setTrustLevelFilter(null)}
                    >
                      Trust Level {trustLevelFilter}+ ×
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Contacts Grid */}
            {filteredContacts.length === 0 ? (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No contacts found</h3>
                  <p className="text-slate-500 text-center mb-4">
                    {contacts.length === 0 
                      ? "Get started by adding your first Web3 contact" 
                      : "Try adjusting your search or filter criteria"
                    }
                  </p>
                  {contacts.length === 0 && (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Contact
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredContacts.map(contact => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onUpdate={handleUpdateContact}
                    onDelete={handleDeleteContact}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Contact Dialog */}
      <AddContactDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddContact}
        existingTags={allTags}
      />
    </div>
  );
};

export default Index;
