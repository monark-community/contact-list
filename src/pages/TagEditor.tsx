import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const TagEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewTag = id === 'new';

  const [tagData, setTagData] = useState({
    name: '',
    description: '',
    trustModifier: [0],
  });

  const handleSave = () => {
    if (!tagData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Tag name is required",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to backend
    toast({
      title: "Tag saved",
      description: isNewTag ? "New tag created successfully" : "Tag updated successfully",
    });
    navigate('/tags');
  };

  const handleDelete = () => {
    // In a real app, this would delete from backend
    toast({
      title: "Tag deleted",
      description: "Tag has been removed",
    });
    navigate('/tags');
  };

  const getTrustModifierColor = (modifier: number) => {
    if (modifier > 0) return 'text-green-600';
    if (modifier < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrustModifierBgColor = (modifier: number) => {
    if (modifier > 0) return 'bg-green-500';
    if (modifier < 0) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getTrustModifierText = (modifier: number) => {
    if (modifier > 0) return `+${modifier}`;
    return modifier.toString();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/tags')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tags
            </Button>
            {!isNewTag && (
              <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Tag
              </Button>
            )}
          </div>

          <div className="mx-auto">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {isNewTag ? 'Create New Tag' : 'Edit Tag'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tag Name */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Tag Name *
                  </label>
                  <Input
                    value={tagData.name}
                    onChange={(e) => setTagData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter tag name..."
                    className="text-lg"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Description
                  </label>
                  <Textarea
                    value={tagData.description}
                    onChange={(e) => setTagData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this tag represents..."
                    className="resize-none"
                    rows={3}
                  />
                </div>

                {/* Trust Score Modifier */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-sm font-medium text-slate-700">
                      Trust Score Modifier
                    </label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-slate-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          This modifier will be automatically applied to contacts with this tag. 
                          Positive values increase trust, negative values decrease it.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <span 
                        className={`text-2xl font-bold ${getTrustModifierColor(tagData.trustModifier[0])}`}
                      >
                        {getTrustModifierText(tagData.trustModifier[0])}
                      </span>
                    </div>

                    <div className="relative">
                      <div 
                        className="w-full rounded-full h-6 mb-4 relative overflow-hidden bg-gray-100"
                      >
                        <div 
                          className={`h-6 rounded-full transition-all duration-200 ${getTrustModifierBgColor(tagData.trustModifier[0])}`}
                          style={{ 
                            width: `${Math.abs(tagData.trustModifier[0]) * 10}%`,
                            marginLeft: tagData.trustModifier[0] < 0 ? `${50 - Math.abs(tagData.trustModifier[0]) * 10}%` : '50%'
                          }}
                        />
                        <div className="absolute inset-0">
                          <Slider
                            value={tagData.trustModifier}
                            onValueChange={(value) => setTagData(prev => ({ ...prev, trustModifier: value }))}
                            max={5}
                            min={-5}
                            step={1}
                            className="w-full h-6 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:shadow-md [&_[role=slider]]:w-6 [&_[role=slider]]:h-6"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500">
                      <span className="text-red-600">Decreases Trust (-5)</span>
                      <span className="text-gray-600">Neutral (0)</span>
                      <span className="text-green-600">Increases Trust (+5)</span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {tagData.name && (
                  <div className="border-t pt-6">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Preview</h4>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded text-sm">
                          {tagData.name}
                        </div>
                        {tagData.trustModifier[0] !== 0 && (
                          <div className={`px-2 py-1 rounded text-xs ${
                            tagData.trustModifier[0] > 0 
                              ? 'bg-green-50 text-green-600 border border-green-200' 
                              : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {getTrustModifierText(tagData.trustModifier[0])} trust
                          </div>
                        )}
                      </div>
                      {tagData.description && (
                        <p className="text-sm text-slate-600 mt-2">{tagData.description}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    {isNewTag ? 'Create Tag' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/tags')}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TagEditor;
