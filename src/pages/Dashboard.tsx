import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import FilterPanel from "@/components/FilterPanel";
import BulkActionsToolbar from "@/components/BulkActionsToolbar";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

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

// Expanded mock data with 50+ contacts
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
    name: 'Suspicious Account',
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
    name: 'Unverified User',
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
  },
  {
    id: '11',
    address: '0x4f8h2j109551bD432803012645Hac136c9331q8k6l',
    name: 'Isabella Rodriguez',
    tags: ['Investor', 'High Value', 'VIP'],
    notes: 'Angel investor in multiple DeFi projects. Excellent track record.',
    role: 'Angel Investor',
    trustLevel: 9,
    lastInteraction: new Date('2024-06-01'),
    interactionCount: 52
  },
  {
    id: '12',
    address: '0x7m9n1p109551bD432803012645Hac136c9331q8r4s',
    name: 'Jack Thompson',
    tags: ['Developer', 'Smart Contract'],
    notes: 'Experienced smart contract auditor. Very thorough in code reviews.',
    role: 'Smart Contract Auditor',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-29'),
    interactionCount: 28
  },
  {
    id: '13',
    address: '0x2t4u6v109551bD432803012645Hac136c9331q8w8x',
    name: 'Flagged Account',
    tags: ['Flagged', 'Suspicious Activity'],
    notes: 'Multiple reports of failed transactions and unresponsive behavior.',
    role: 'Unknown',
    trustLevel: 1,
    lastInteraction: new Date('2024-05-15'),
    interactionCount: 1
  },
  {
    id: '14',
    address: '0x9y1z3a109551bD432803012645Hac136c9331q8b5c',
    name: 'Liam Foster',
    tags: ['NFT Creator', 'Artist'],
    notes: 'Digital artist with growing reputation in the NFT space.',
    role: 'NFT Artist',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-28'),
    interactionCount: 14
  },
  {
    id: '15',
    address: '0x6d8f0g109551bD432803012645Hac136c9331q8h2i',
    name: 'Maya Patel',
    tags: ['DAO Member', 'Governance', 'Active'],
    notes: 'Very active in DAO governance discussions and proposals.',
    role: 'DAO Contributor',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-30'),
    interactionCount: 39
  },
  // Adding 35 more contacts for pagination
  {
    id: '16',
    address: '0xa1b2c3d4e5f6789012345678901234567890abcd',
    name: 'Nathan Brooks',
    tags: ['Trader', 'DeFi'],
    notes: 'Active trader with focus on yield farming strategies.',
    role: 'DeFi Trader',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-29'),
    interactionCount: 42
  },
  {
    id: '17',
    address: '0xb2c3d4e5f6789012345678901234567890abcdef',
    name: 'Olivia Martinez',
    tags: ['Protocol', 'Founder'],
    notes: 'Founder of emerging lending protocol.',
    role: 'Protocol Founder',
    trustLevel: 8,
    lastInteraction: new Date('2024-06-02'),
    interactionCount: 19
  },
  {
    id: '18',
    address: '0xc3d4e5f6789012345678901234567890abcdef12',
    name: 'Paul Anderson',
    tags: ['Client', 'Institutional'],
    notes: 'Institutional client with large volume transactions.',
    role: 'Institution Manager',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-31'),
    interactionCount: 87
  },
  {
    id: '19',
    address: '0xd4e5f6789012345678901234567890abcdef1234',
    name: 'Quinn Taylor',
    tags: ['Developer', 'Frontend'],
    notes: 'Frontend developer building dApp interfaces.',
    role: 'Frontend Developer',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-27'),
    interactionCount: 22
  },
  {
    id: '20',
    address: '0xe5f6789012345678901234567890abcdef123456',
    name: 'Rachel White',
    tags: ['Investor', 'VC'],
    notes: 'Venture capitalist focused on DeFi investments.',
    role: 'VC Partner',
    trustLevel: 9,
    lastInteraction: new Date('2024-06-01'),
    interactionCount: 33
  },
  {
    id: '21',
    address: '0xf6789012345678901234567890abcdef12345678',
    name: 'Sam Garcia',
    tags: ['Auditor', 'Security'],
    notes: 'Security auditor specializing in smart contract reviews.',
    role: 'Security Auditor',
    trustLevel: 9,
    lastInteraction: new Date('2024-05-30'),
    interactionCount: 16
  },
  {
    id: '22',
    address: '0x789012345678901234567890abcdef123456789a',
    name: 'Tina Johnson',
    tags: ['Community', 'Manager'],
    notes: 'Community manager for popular DeFi protocol.',
    role: 'Community Manager',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-28'),
    interactionCount: 41
  },
  {
    id: '23',
    address: '0x89012345678901234567890abcdef123456789ab',
    name: 'Umar Hassan',
    tags: ['Trader', 'MEV'],
    notes: 'MEV searcher and arbitrage trader.',
    role: 'MEV Searcher',
    trustLevel: 5,
    lastInteraction: new Date('2024-05-26'),
    interactionCount: 73
  },
  {
    id: '24',
    address: '0x9012345678901234567890abcdef123456789abc',
    name: 'Vera Chen',
    tags: ['Designer', 'UX'],
    notes: 'UX designer for Web3 applications.',
    role: 'UX Designer',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-29'),
    interactionCount: 25
  },
  {
    id: '25',
    address: '0x012345678901234567890abcdef123456789abcd',
    name: 'Will Thompson',
    tags: ['Validator', 'Staking'],
    notes: 'Professional validator running multiple nodes.',
    role: 'Validator',
    trustLevel: 8,
    lastInteraction: new Date('2024-06-01'),
    interactionCount: 56
  },
  // Continue with more contacts to reach 50+
  {
    id: '26',
    address: '0x12345678901234567890abcdef123456789abcde',
    name: 'Xander Liu',
    tags: ['Researcher', 'Academic'],
    notes: 'Blockchain researcher at university.',
    role: 'Researcher',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-25'),
    interactionCount: 11
  },
  {
    id: '27',
    address: '0x2345678901234567890abcdef123456789abcdef',
    name: 'Yara Okafor',
    tags: ['Journalist', 'Media'],
    notes: 'Crypto journalist covering DeFi trends.',
    role: 'Journalist',
    trustLevel: 5,
    lastInteraction: new Date('2024-05-24'),
    interactionCount: 8
  },
  {
    id: '28',
    address: '0x345678901234567890abcdef123456789abcdef1',
    name: 'Zoe Mitchell',
    tags: ['Legal', 'Compliance'],
    notes: 'Legal advisor specializing in DeFi compliance.',
    role: 'Legal Advisor',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-30'),
    interactionCount: 34
  },
  {
    id: '29',
    address: '0x45678901234567890abcdef123456789abcdef12',
    name: 'Aaron Davis',
    tags: ['Bot', 'Automated'],
    notes: 'Automated trading bot with consistent patterns.',
    role: 'Trading Bot',
    trustLevel: 4,
    lastInteraction: new Date('2024-06-02'),
    interactionCount: 156
  },
  {
    id: '30',
    address: '0x5678901234567890abcdef123456789abcdef123',
    name: 'Betty Johnson',
    tags: ['Retail', 'Frequent'],
    notes: 'Frequent retail user of DEX platforms.',
    role: 'Retail Trader',
    trustLevel: 5,
    lastInteraction: new Date('2024-05-28'),
    interactionCount: 91
  },
  // Adding 20 more contacts
  {
    id: '31',
    address: '0x678901234567890abcdef123456789abcdef1234',
    name: 'Carlos Rodriguez',
    tags: ['Bridge', 'Operator'],
    notes: 'Cross-chain bridge operator.',
    role: 'Bridge Operator',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-31'),
    interactionCount: 48
  },
  {
    id: '32',
    address: '0x78901234567890abcdef123456789abcdef12345',
    name: 'Diana Park',
    tags: ['Yield', 'Farmer'],
    notes: 'Professional yield farmer across multiple protocols.',
    role: 'Yield Farmer',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-29'),
    interactionCount: 122
  },
  {
    id: '33',
    address: '0x8901234567890abcdef123456789abcdef123456',
    name: 'Ethan Brown',
    tags: ['Oracle', 'Provider'],
    notes: 'Oracle data provider for price feeds.',
    role: 'Oracle Provider',
    trustLevel: 8,
    lastInteraction: new Date('2024-06-01'),
    interactionCount: 37
  },
  {
    id: '34',
    address: '0x901234567890abcdef123456789abcdef1234567',
    name: 'Fiona Walsh',
    tags: ['Governance', 'Proposal'],
    notes: 'Active in governance proposals and voting.',
    role: 'Governance Participant',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-30'),
    interactionCount: 29
  },
  {
    id: '35',
    address: '0x01234567890abcdef123456789abcdef12345678',
    name: 'George Kim',
    tags: ['Liquidity', 'Provider'],
    notes: 'Major liquidity provider on AMM platforms.',
    role: 'LP Provider',
    trustLevel: 8,
    lastInteraction: new Date('2024-06-02'),
    interactionCount: 84
  },
  {
    id: '36',
    address: '0x1234567890abcdef123456789abcdef123456789',
    name: 'Hannah Scott',
    tags: ['Analytics', 'Data'],
    notes: 'On-chain analytics and data provider.',
    role: 'Data Analyst',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-27'),
    interactionCount: 21
  },
  {
    id: '37',
    address: '0x234567890abcdef123456789abcdef123456789a',
    name: 'Ian Cooper',
    tags: ['Flash', 'Loan'],
    notes: 'Flash loan arbitrage specialist.',
    role: 'Arbitrageur',
    trustLevel: 5,
    lastInteraction: new Date('2024-05-26'),
    interactionCount: 67
  },
  {
    id: '38',
    address: '0x34567890abcdef123456789abcdef123456789ab',
    name: 'Julia Martinez',
    tags: ['Insurance', 'Protocol'],
    notes: 'DeFi insurance protocol operator.',
    role: 'Insurance Provider',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-28'),
    interactionCount: 31
  },
  {
    id: '39',
    address: '0x4567890abcdef123456789abcdef123456789abc',
    name: 'Kevin Zhang',
    tags: ['MEV', 'Protection'],
    notes: 'MEV protection service provider.',
    role: 'MEV Protector',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-31'),
    interactionCount: 43
  },
  {
    id: '40',
    address: '0x567890abcdef123456789abcdef123456789abcd',
    name: 'Luna Adams',
    tags: ['Social', 'Token'],
    notes: 'Social token creator and community builder.',
    role: 'Community Builder',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-29'),
    interactionCount: 38
  },
  {
    id: '41',
    address: '0x67890abcdef123456789abcdef123456789abcde',
    name: 'Marco Silva',
    tags: ['NFT', 'Marketplace'],
    notes: 'NFT marketplace operator and curator.',
    role: 'NFT Curator',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-30'),
    interactionCount: 55
  },
  {
    id: '42',
    address: '0x7890abcdef123456789abcdef123456789abcdef',
    name: 'Nina Petrov',
    tags: ['Cross-chain', 'Bridge'],
    notes: 'Cross-chain bridge developer.',
    role: 'Bridge Developer',
    trustLevel: 8,
    lastInteraction: new Date('2024-06-01'),
    interactionCount: 26
  },
  {
    id: '43',
    address: '0x890abcdef123456789abcdef123456789abcdef1',
    name: 'Oscar Lee',
    tags: ['Gaming', 'DeFi'],
    notes: 'GameFi protocol developer.',
    role: 'GameFi Developer',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-28'),
    interactionCount: 33
  },
  {
    id: '44',
    address: '0x90abcdef123456789abcdef123456789abcdef12',
    name: 'Petra Novak',
    tags: ['DAO', 'Treasury'],
    notes: 'DAO treasury management specialist.',
    role: 'Treasury Manager',
    trustLevel: 9,
    lastInteraction: new Date('2024-06-02'),
    interactionCount: 41
  },
  {
    id: '45',
    address: '0x0abcdef123456789abcdef123456789abcdef123',
    name: 'Quin Taylor',
    tags: ['Layer2', 'Scaling'],
    notes: 'Layer 2 scaling solution developer.',
    role: 'L2 Developer',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-31'),
    interactionCount: 19
  },
  {
    id: '46',
    address: '0xabcdef123456789abcdef123456789abcdef1234',
    name: 'Rita Johnson',
    tags: ['Stablecoin', 'Issuer'],
    notes: 'Stablecoin protocol operator.',
    role: 'Stablecoin Issuer',
    trustLevel: 9,
    lastInteraction: new Date('2024-06-01'),
    interactionCount: 62
  },
  {
    id: '47',
    address: '0xbcdef123456789abcdef123456789abcdef12345',
    name: 'Steve Wilson',
    tags: ['Aggregator', 'DEX'],
    notes: 'DEX aggregator service provider.',
    role: 'DEX Aggregator',
    trustLevel: 7,
    lastInteraction: new Date('2024-05-30'),
    interactionCount: 78
  },
  {
    id: '48',
    address: '0xcdef123456789abcdef123456789abcdef123456',
    name: 'Tara Singh',
    tags: ['Privacy', 'Protocol'],
    notes: 'Privacy-focused DeFi protocol developer.',
    role: 'Privacy Developer',
    trustLevel: 8,
    lastInteraction: new Date('2024-05-29'),
    interactionCount: 24
  },
  {
    id: '49',
    address: '0xdef123456789abcdef123456789abcdef1234567',
    name: 'Uma Patel',
    tags: ['Derivatives', 'Trading'],
    notes: 'DeFi derivatives trading specialist.',
    role: 'Derivatives Trader',
    trustLevel: 6,
    lastInteraction: new Date('2024-05-28'),
    interactionCount: 89
  },
  {
    id: '50',
    address: '0xef123456789abcdef123456789abcdef12345678',
    name: 'Victor Chen',
    tags: ['Wallet', 'Provider'],
    notes: 'Web3 wallet service provider.',
    role: 'Wallet Provider',
    trustLevel: 8,
    lastInteraction: new Date('2024-06-02'),
    interactionCount: 47
  }
];

const ITEMS_PER_PAGE = 20;

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [trustLevelFilter, setTrustLevelFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Get all unique tags from contacts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [contacts]);

  // Filter contacts based on search and filters
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
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
  }, [searchTerm, selectedTags, trustLevelFilter, contacts]);

  const handleAddContact = () => {
    navigate('/contact/new');
  };

  const handleRowClick = (contactId: string) => {
    navigate(`/contact/${contactId}`);
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(paginatedContacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleBulkDelete = () => {
    setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
    setSelectedContacts([]);
  };

  const handleBulkTrustLevel = (trustLevel: number) => {
    setContacts(prev => prev.map(contact => 
      selectedContacts.includes(contact.id) 
        ? { ...contact, trustLevel }
        : contact
    ));
    setSelectedContacts([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedContacts([]); // Clear selections when changing pages
  };

  // Get the number of pages based on the filtered contacts and items per page
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Format date function
  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Get trust level color function
  const getTrustLevelColor = (level: number) => {
    if (level <= 3) return 'text-red-600';
    if (level <= 5) return 'text-amber-600';
    if (level <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Get trust level background color function
  const getTrustLevelBg = (level: number) => {
    if (level <= 3) return 'bg-red-100';
    if (level <= 5) return 'bg-amber-100';
    if (level <= 7) return 'bg-yellow-100';
    return 'bg-green-100';
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

          {/* Bulk Actions Toolbar */}
          {selectedContacts.length > 0 && (
            <BulkActionsToolbar
              selectedCount={selectedContacts.length}
              onClearSelection={() => setSelectedContacts([])}
              onBulkDelete={handleBulkDelete}
              onBulkTrustLevel={handleBulkTrustLevel}
            />
          )}
        </div>

        {/* Contacts Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Trust Level</TableHead>
                  <TableHead>Last Interaction</TableHead>
                  <TableHead>Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContacts.map(contact => (
                  <TableRow 
                    key={contact.id} 
                    className="hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => handleRowClick(contact.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">
                          {contact.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-slate-500 font-mono">
                          {contact.address.slice(0, 10)}...{contact.address.slice(-8)}
                        </div>
                        {contact.role && (
                          <div className="text-xs text-slate-400">{contact.role}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map(tag => (
                          <Badge 
                            key={tag}
                            variant="secondary" 
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTrustLevelBg(contact.trustLevel)} ${getTrustLevelColor(contact.trustLevel)}`}>
                          {contact.trustLevel}/10
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {formatDate(contact.lastInteraction)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {contact.interactionCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredContacts.length === 0 && (
              <div className="p-8 text-center">
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
