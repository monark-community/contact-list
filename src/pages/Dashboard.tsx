
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ContactCard from "@/components/ContactCard";
import FilterPanel from "@/components/FilterPanel";
import { useNavigate } from 'react-router-dom';

export interface Contact {
  id: string;
  address: string;
  name?: string;
  tags: string[];
  notes?: string;
  role?: string;
  trustLevel: number;
  lastInteraction?: Date;
  interactionCount: number;
}

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
  },
  {
    id: '4',
    address: '0x3f2h4i109551bD432803012645Hac136c9331q8d4e',
    name: 'Carol Davis',
    tags: ['Designer', 'NFT Creator'],
    notes: 'Talented digital artist and NFT creator. Creates amazing artwork.',
    role: 'Digital Artist',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-26'),
    interactionCount: 12
  },
  {
    id: '5',
    address: '0x1a3c5e109551bD432803012645Hac136c9331q8f6g',
    name: 'David Wilson',
    tags: ['DAO Member', 'Validator'],
    notes: 'Active DAO participant and validator. Very knowledgeable about governance.',
    role: 'DAO Governance Lead',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-29'),
    interactionCount: 31
  },
  {
    id: '6',
    address: '0x5h7j9k109551bD432803012645Hac136c9331q8l2m',
    name: 'Emma Thompson',
    tags: ['DeFi Protocol', 'Partner'],
    notes: 'Protocol founder and strategic partner for yield farming initiatives.',
    role: 'Protocol Founder',
    trustLevel: 9,
    lastInteraction: new Date('2024-05-27'),
    interactionCount: 45
  },
  {
    id: '7',
    address: '0x2n4p6q109551bD432803012645Hac136c9331q8r8s',
    name: 'Frank Miller',
    tags: ['Regular Client', 'VIP'],
    notes: 'Long-term client with consistent trading patterns. VIP status.',
    role: 'Institutional Trader',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-31'),
    interactionCount: 67
  },
  {
    id: '8',
    address: '0x6t8u0v109551bD432803012645Hac136c9331q8w4x',
    tags: ['Unverified'],
    notes: 'New contact, limited transaction history.',
    role: 'Unknown',
    trustLevel: 4,
    lastInteraction: new Date('2024-05-24'),
    interactionCount: 2
  },
  {
    id: '9',
    address: '0x4y6z2a109551bD432803012645Hac136c9331q8b8c',
    name: 'Grace Chen',
    tags: ['Developer', 'High Value'],
    notes: 'Full-stack developer specializing in Web3 applications.',
    role: 'Web3 Developer',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-25'),
    interactionCount: 18
  },
  {
    id: '10',
    address: '0x8d0f2g109551bD432803012645Hac136c9331q8h4i',
    name: 'Henry Lee',
    tags: ['Client', 'Regular Client'],
    notes: 'Steady client for token swaps and liquidity provision.',
    role: 'DeFi User',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-23'),
    interactionCount: 29
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [trustLevelFilter, setTrustLevelFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags from contacts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    mockContacts.forEach(contact => {
      contact.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, []);

  // Filter contacts based on search and filters
  const filteredContacts = useMemo(() => {
    return mockContacts.filter(contact => {
      // Search filter
      const matchesSearch = !searchTerm || 
        contact.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => contact.tags.includes(tag));

      // Trust level filter
      const matchesTrustLevel = trustLevelFilter === null || 
        contact.trustLevel >= trustLevelFilter;

      return matchesSearch && matchesTags && matchesTrustLevel;
    });
  }, [searchTerm, selectedTags, trustLevelFilter]);

  const handleAddContact = () => {
    navigate('/contact/new');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Contact Dashboard</h1>
          <p className="text-slate-600">Manage your Web3 contacts and their trust levels</p>
        </div>

        <div className="mb-6 space-y-4">
          {/* Search Bar and Filter Toggle */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search contacts by address, name, role, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-slate-200"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/70 backdrop-blur-sm border-slate-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
            <Button onClick={handleAddContact}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <FilterPanel
                allTags={allTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                trustLevelFilter={trustLevelFilter}
                onTrustLevelChange={setTrustLevelFilter}
              />
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Showing {filteredContacts.length} of {mockContacts.length} contacts
                </span>
                {(selectedTags.length > 0 || trustLevelFilter !== null || searchTerm) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTags([]);
                      setTrustLevelFilter(null);
                    }}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No contacts found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || selectedTags.length > 0 || trustLevelFilter !== null
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first contact"}
              </p>
              <Button onClick={handleAddContact}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
