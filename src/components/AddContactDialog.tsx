
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Contact } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: Omit<Contact, 'id'>) => void;
  existingTags: string[];
}

const predefinedTags = [
  'Developer', 'Designer', 'Client', 'Partner', 'Trusted Partner',
  'NFT Creator', 'DeFi Protocol', 'DAO Member', 'Validator',
  'High Value', 'Regular Client', 'New Contact', 'VIP',
  'Flagged', 'Potential Scam', 'Unverified', 'Inactive'
];

const AddContactDialog: React.FC<AddContactDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingTags
}) => {
  const [formData, setFormData] = useState({
    address: '',
    name: '',
    role: '',
    notes: '',
    trustLevel: [5],
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address.trim()) {
      toast({
        title: "Address required",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }

    if (!formData.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Ethereum wallet address",
        variant: "destructive",
      });
      return;
    }

    const newContact: Omit<Contact, 'id'> = {
      address: formData.address.toLowerCase(),
      name: formData.name.trim() || undefined,
      role: formData.role.trim() || 'Unknown',
      notes: formData.notes.trim(),
      tags: selectedTags,
      trustLevel: formData.trustLevel[0],
      interactionCount: 0,
    };

    onAdd(newContact);
    
    // Reset form
    setFormData({
      address: '',
      name: '',
      role: '',
      notes: '',
      trustLevel: [5],
    });
    setSelectedTags([]);
    setNewTag('');
    
    toast({
      title: "Contact added",
      description: "New contact has been successfully added to your list",
    });
    
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handlePredefinedTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const allAvailableTags = [...new Set([...predefinedTags, ...existingTags])];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Contact
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Wallet Address */}
          <div>
            <Label htmlFor="address" className="text-sm font-medium text-slate-700">
              Wallet Address *
            </Label>
            <Input
              id="address"
              placeholder="0x742d35Cc6634C0532925a3b8D5c8c50B7C3a5d2A"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="mt-1 font-mono text-sm"
              required
            />
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Display Name
            </Label>
            <Input
              id="name"
              placeholder="Enter a friendly name (optional)"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role" className="text-sm font-medium text-slate-700">
              Role
            </Label>
            <Input
              id="role"
              placeholder="e.g., Developer, Client, Partner"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Trust Level */}
          <div>
            <Label className="text-sm font-medium text-slate-700">
              Trust Level: {formData.trustLevel[0]}/10
            </Label>
            <div className="mt-2 px-2">
              <Slider
                value={formData.trustLevel}
                onValueChange={(value) => setFormData(prev => ({ ...prev, trustLevel: value }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Low Trust</span>
              <span>High Trust</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium text-slate-700">Tags</Label>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedTags.map(tag => (
                  <Badge 
                    key={tag}
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800 pr-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Custom Tag */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add custom tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="text-sm"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddTag}
                disabled={!newTag.trim() || selectedTags.includes(newTag.trim())}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Predefined Tags */}
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">Quick tags:</p>
              <div className="flex flex-wrap gap-1">
                {allAvailableTags.slice(0, 8).map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer text-xs hover:bg-blue-50 ${
                      selectedTags.includes(tag) ? 'bg-blue-100 border-blue-300' : ''
                    }`}
                    onClick={() => handlePredefinedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this contact..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
