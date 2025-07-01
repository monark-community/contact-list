import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BulkActionsToolbar from "@/components/BulkActionsToolbar";
import FilterPanel from "@/components/FilterPanel";

export interface Contact {
  id: string;
  address: string;
  name: string;
  tags: string[];
  notes: string;
  role: string;
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
    name: 'Charlie Brown',
    tags: ['Flagged', 'Potential Scam'],
    notes: 'Multiple failed transactions and suspicious behavior.',
    role: 'Unknown',
    trustLevel: 2,
    lastInteraction: new Date('2024-05-20'),
    interactionCount: 3
  },
  {
    id: '4',
    address: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    name: 'Diana Lee',
    tags: ['DAO Member', 'Validator'],
    notes: 'Active in governance and staking.',
    role: 'Governance Participant',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-25'),
    interactionCount: 18
  },
  {
    id: '5',
    address: '0xf2e3d4c5b6a7e8d9c0b1a2f3e4d5c6b7a8e9d0c1',
    name: 'Ethan White',
    tags: ['Investor', 'VIP'],
    notes: 'Early investor in several successful blockchain projects.',
    role: 'Venture Capitalist',
    trustLevel: 9,
    lastInteraction: new Date('2024-05-22'),
    interactionCount: 27
  },
  {
    id: '6',
    address: '0x3d4c5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    name: 'Fiona Green',
    tags: ['NFT Creator', 'Designer'],
    notes: 'Creates and sells digital art on various NFT marketplaces.',
    role: 'Digital Artist',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-29'),
    interactionCount: 21
  },
  {
    id: '7',
    address: '0xc4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
    name: 'George Black',
    tags: ['Exchange', 'Institutional'],
    notes: 'Represents a major cryptocurrency exchange.',
    role: 'Exchange Representative',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-18'),
    interactionCount: 9
  },
  {
    id: '8',
    address: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    name: 'Hannah Grey',
    tags: ['Mining Pool', 'Validator'],
    notes: 'Operates a large-scale mining pool.',
    role: 'Mining Pool Operator',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-24'),
    interactionCount: 14
  },
  {
    id: '9',
    address: '0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
    name: 'Isaac Purple',
    tags: ['Smart Contract', 'Auditor'],
    notes: 'Audits smart contracts for vulnerabilities.',
    role: 'Security Auditor',
    trustLevel: 9,
    lastInteraction: new Date('2024-05-27'),
    interactionCount: 16
  },
  {
    id: '10',
    address: '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    name: 'Julia Silver',
    tags: ['Retail', 'Trader'],
    notes: 'Active in day trading and swing trading.',
    role: 'Retail Trader',
    trustLevel: 5,
    lastInteraction: new Date('2024-05-15'),
    interactionCount: 31
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [trustLevelFilter, setTrustLevelFilter] = useState<number | null>(null);
  const contactsPerPage = 20;

  // Get all unique tags from contacts
  const allTags = Array.from(new Set(mockContacts.flatMap(contact => contact.tags))).sort();

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => contact.tags.includes(tag));
    
    const matchesTrustLevel = trustLevelFilter === null || 
      contact.trustLevel >= trustLevelFilter;
    
    return matchesSearch && matchesTags && matchesTrustLevel;
  });

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, startIndex + contactsPerPage);

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(currentContacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleBulkDelete = () => {
    console.log('Bulk deleting contacts:', selectedContacts);
    setSelectedContacts([]);
  };

  const handleBulkTrustLevel = (trustLevel: number) => {
    console.log('Setting trust level', trustLevel, 'for contacts:', selectedContacts);
    setSelectedContacts([]);
  };

  const clearSelection = () => {
    setSelectedContacts([]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getTrustLevelColor = (level: number) => {
    if (level <= 3) return 'text-red-600 bg-red-50';
    if (level <= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Contact Dashboard</h1>
          <p className="text-slate-600">Manage your Web3 contacts and build trust relationships</p>
        </div>

        {/* Search Bar and Actions Row */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button onClick={() => navigate('/contact/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6">
            <FilterPanel
              allTags={allTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              trustLevelFilter={trustLevelFilter}
              onTrustLevelChange={setTrustLevelFilter}
            />
          </div>
        )}

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
          <CardContent className="p-6">
            {selectedContacts.length > 0 && (
              <BulkActionsToolbar
                selectedCount={selectedContacts.length}
                onClearSelection={clearSelection}
                onBulkDelete={handleBulkDelete}
                onBulkTrustLevel={handleBulkTrustLevel}
              />
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedContacts.length === currentContacts.length && currentContacts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Trust Level</TableHead>
                  <TableHead>Last Interaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentContacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className="cursor-pointer hover:bg-slate-50/50"
                    onClick={() => navigate(`/contact/${contact.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{contact.name}</div>
                        <div className="text-sm text-slate-500">{contact.role}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm text-slate-600">
                        {contact.address.slice(0, 6)}...{contact.address.slice(-4)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-500">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTrustLevelColor(contact.trustLevel)} border-0`}>
                        {contact.trustLevel}/10
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {formatDate(contact.lastInteraction)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg mb-4">No contacts found</p>
                <Button onClick={() => navigate('/contact/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Contact
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
