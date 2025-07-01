
import React, { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Preferences = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [trustPolicy, setTrustPolicy] = useState('moderate');
  const [leverageNetwork, setLeverageNetwork] = useState(true);
  const [networkDepth, setNetworkDepth] = useState('2');

  const handleSave = () => {
    // In a real app, this would save to backend/local storage
    toast({
      title: "Preferences saved",
      description: "Your trust policy settings have been updated",
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trust Preferences
              </CardTitle>
              <p className="text-slate-600">
                Configure how the platform calculates and suggests trust levels for your contacts.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Trust Policy */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">Trust Policy Algorithm</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Different algorithms affect how strictly trust levels are calculated. 
                        Conservative policies result in lower suggested trust levels.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select value={trustPolicy} onValueChange={setTrustPolicy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select trust policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">
                      Conservative - Lower trust levels, higher security
                    </SelectItem>
                    <SelectItem value="moderate">
                      Moderate - Balanced approach (recommended)
                    </SelectItem>
                    <SelectItem value="liberal">
                      Liberal - Higher trust levels, more permissive
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-slate-600">
                  {trustPolicy === 'conservative' && 
                    "Suggested trust levels will be 20-30% lower than standard calculations."
                  }
                  {trustPolicy === 'moderate' && 
                    "Balanced trust calculations based on transaction history and network reputation."
                  }
                  {trustPolicy === 'liberal' && 
                    "More generous trust calculations, suitable for established networks."
                  }
                </div>
              </div>

              {/* Network Trust */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">Network Trust Leverage</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        When enabled, trust levels of your high-trust contacts influence 
                        the suggested trust levels for contacts you have in common, 
                        even with limited direct transaction history.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="leverage-network"
                    checked={leverageNetwork}
                    onCheckedChange={setLeverageNetwork}
                  />
                  <Label htmlFor="leverage-network">
                    Use network trust to evaluate contacts
                  </Label>
                </div>
                <p className="text-sm text-slate-600">
                  Leverage your trusted contacts' trust levels to better evaluate mutual connections.
                </p>
              </div>

              {/* Network Depth */}
              {leverageNetwork && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium">Network Depth</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-slate-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          How many degrees of separation to consider when evaluating network trust. 
                          Higher depths include more distant connections but may be less reliable.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={networkDepth} onValueChange={setNetworkDepth}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select network depth" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        1 Level - Only direct mutual contacts
                      </SelectItem>
                      <SelectItem value="2">
                        2 Levels - Friends of friends (recommended)
                      </SelectItem>
                      <SelectItem value="3">
                        3 Levels - Extended network
                      </SelectItem>
                      <SelectItem value="4">
                        4 Levels - Broad network analysis
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-slate-600">
                    {networkDepth === '1' && 
                      "Only consider contacts you both trust directly."
                    }
                    {networkDepth === '2' && 
                      "Include friends of friends in trust calculations."
                    }
                    {networkDepth === '3' && 
                      "Analyze extended network connections (may include some noise)."
                    }
                    {networkDepth === '4' && 
                      "Broad network analysis (less reliable for trust decisions)."
                    }
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-6 border-t">
                <Button onClick={handleSave} className="w-full">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Preferences;
