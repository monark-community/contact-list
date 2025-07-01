import React, { useState } from 'react';
import { Trash2, Shield, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkTrustLevel: (trustLevel: number) => void;
}

const BulkActionsToolbar = ({ selectedCount, onClearSelection, onBulkDelete, onBulkTrustLevel }: BulkActionsToolbarProps) => {
  const { toast } = useToast();
  const [showTrustDialog, setShowTrustDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [trustLevel, setTrustLevel] = useState([5]);

  const handleBulkTrustLevel = () => {
    onBulkTrustLevel(trustLevel[0]);
    setShowTrustDialog(false);
    toast({
      title: "Trust level updated",
      description: `Updated trust level for ${selectedCount} contacts to ${trustLevel[0]}/10`,
    });
  };

  const handleBulkDelete = () => {
    onBulkDelete();
    setShowDeleteDialog(false);
    onClearSelection();
    toast({
      title: "Contacts deleted",
      description: `Successfully deleted ${selectedCount} contacts`,
    });
  };

  const getTrustLevelColor = (level: number) => {
    if (level <= 3) return 'bg-red-500';
    if (level <= 5) return 'bg-amber-500';
    if (level <= 7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-blue-700">
            {selectedCount} contact{selectedCount !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTrustDialog(true)}
              className="bg-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Set Trust Level
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Trust Level Dialog */}
      <Dialog open={showTrustDialog} onOpenChange={setShowTrustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Trust Level</DialogTitle>
            <DialogDescription>
              Set the trust level for {selectedCount} selected contact{selectedCount !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Trust Level</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getTrustLevelColor(trustLevel[0])}`}></div>
                  <span className="text-lg font-bold text-slate-900">{trustLevel[0]}/10</span>
                </div>
              </div>
              <div className="space-y-3">
                <Slider
                  value={trustLevel}
                  onValueChange={setTrustLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Low Trust</span>
                  <span>High Trust</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTrustDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkTrustLevel}>
              Update Trust Level
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contacts</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} contact{selectedCount !== 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkActionsToolbar;
