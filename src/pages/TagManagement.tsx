
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

interface Tag {
  id: string;
  name: string;
  description: string;
  trustModifier: number;
  usageCount: number;
  createdAt: Date;
}

const mockTags: Tag[] = [
  {
    id: '1',
    name: 'Trusted Partner',
    description: 'Long-term business partners with proven track record',
    trustModifier: 2,
    usageCount: 15,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'High Value',
    description: 'Contacts with significant transaction volumes',
    trustModifier: 1,
    usageCount: 23,
    createdAt: new Date('2024-02-10')
  },
  {
    id: '3',
    name: 'Developer',
    description: 'Software developers and technical contributors',
    trustModifier: 1,
    usageCount: 8,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '4',
    name: 'Flagged',
    description: 'Contacts requiring additional scrutiny',
    trustModifier: -3,
    usageCount: 5,
    createdAt: new Date('2024-03-01')
  },
  {
    id: '5',
    name: 'Potential Scam',
    description: 'Suspected fraudulent or malicious actors',
    trustModifier: -5,
    usageCount: 2,
    createdAt: new Date('2024-03-15')
  },
  {
    id: '6',
    name: 'Client',
    description: 'Regular business clients',
    trustModifier: 0,
    usageCount: 32,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '7',
    name: 'DeFi Protocol',
    description: 'Decentralized finance protocol addresses',
    trustModifier: 1,
    usageCount: 12,
    createdAt: new Date('2024-02-20')
  },
  {
    id: '8',
    name: 'Exchange',
    description: 'Cryptocurrency exchange addresses',
    trustModifier: 0,
    usageCount: 28,
    createdAt: new Date('2024-01-10')
  }
];

const TagManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 20;

  const filteredTags = mockTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTags.length / tagsPerPage);
  const startIndex = (currentPage - 1) * tagsPerPage;
  const currentTags = filteredTags.slice(startIndex, startIndex + tagsPerPage);

  const handleSelectTag = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTags(prev => [...prev, tagId]);
    } else {
      setSelectedTags(prev => prev.filter(id => id !== tagId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTags(currentTags.map(tag => tag.id));
    } else {
      setSelectedTags([]);
    }
  };

  const handleBulkDelete = () => {
    console.log('Bulk deleting tags:', selectedTags);
    setSelectedTags([]);
  };

  const clearSelection = () => {
    setSelectedTags([]);
  };

  const getTrustModifierColor = (modifier: number) => {
    if (modifier > 0) return 'text-green-600 bg-green-50';
    if (modifier < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTrustModifierText = (modifier: number) => {
    if (modifier > 0) return `+${modifier}`;
    return modifier.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Tag Management</h1>
          <p className="text-slate-600">Organize and manage your contact tags with trust modifiers</p>
        </div>

        {/* Search Bar and Actions Row */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tags..."
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
            <Button onClick={() => navigate('/tags/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </div>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
          <CardContent className="p-6">
            {selectedTags.length > 0 && (
              <BulkActionsToolbar
                selectedCount={selectedTags.length}
                onClearSelection={clearSelection}
                onBulkDelete={handleBulkDelete}
                onBulkTrustLevel={() => {}} // Not applicable for tags
              />
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTags.length === currentTags.length && currentTags.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Trust Modifier</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTags.map((tag) => (
                  <TableRow
                    key={tag.id}
                    className="cursor-pointer hover:bg-slate-50/50"
                    onClick={() => navigate(`/tags/${tag.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={(checked) => handleSelectTag(tag.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {tag.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 max-w-xs truncate">
                      {tag.description}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTrustModifierColor(tag.trustModifier)} border-0`}>
                        {getTrustModifierText(tag.trustModifier)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {tag.usageCount} contacts
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {tag.createdAt.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTags.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg mb-4">No tags found</p>
                <Button onClick={() => navigate('/tags/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Tag
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

export default TagManagement;
