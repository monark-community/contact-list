
import React, { useState } from 'react';
import { MoreHorizontal, Copy, ExternalLink, Edit, Trash2, Star, Calendar, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Contact } from "@/pages/Dashboard";
import EditContactDialog from "./EditContactDialog";
import { useToast } from "@/hooks/use-toast";

interface ContactCardProps {
  contact: Contact;
  onUpdate: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onUpdate, onDelete }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contact.address);
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getTrustLevelColor = (level: number) => {
    if (level >= 8) return 'bg-green-100 text-green-800';
    if (level >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrustLevelText = (level: number) => {
    if (level >= 8) return 'High Trust';
    if (level >= 5) return 'Medium Trust';
    return 'Low Trust';
  };

  return (
    <>
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {contact.name && (
                  <h3 className="font-semibold text-slate-900 truncate">
                    {contact.name}
                  </h3>
                )}
                <Badge className={`text-xs ${getTrustLevelColor(contact.trustLevel)}`}>
                  {getTrustLevelText(contact.trustLevel)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                  {formatAddress(contact.address)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="h-6 w-6 p-0 hover:bg-slate-200"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              
              {contact.role && (
                <p className="text-sm text-slate-600 font-medium">{contact.role}</p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Contact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyAddress}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(contact.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Tags */}
          {contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {contact.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Notes */}
          {contact.notes && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {contact.notes}
            </p>
          )}
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Last: {formatDate(contact.lastInteraction)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{contact.interactionCount} interactions</span>
            </div>
          </div>
          
          {/* Trust Level Indicator */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Trust Level</span>
              <span>{contact.trustLevel}/10</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  contact.trustLevel >= 8 ? 'bg-green-500' :
                  contact.trustLevel >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${contact.trustLevel * 10}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <EditContactDialog
        contact={contact}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default ContactCard;
