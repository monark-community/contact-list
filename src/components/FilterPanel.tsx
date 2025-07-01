
import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface FilterPanelProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  trustLevelFilter: number | null;
  onTrustLevelChange: (level: number | null) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  allTags,
  selectedTags,
  onTagsChange,
  trustLevelFilter,
  onTrustLevelChange
}) => {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearFilters = () => {
    onTagsChange([]);
    onTrustLevelChange(null);
  };

  const hasActiveFilters = selectedTags.length > 0 || trustLevelFilter !== null;

  const getTrustLevelColor = (level: number) => {
    // Improved color gradient: red -> yellow -> green
    if (level <= 5) {
      // Red to yellow (1-5)
      const ratio = (level - 1) / 4;
      const red = 220;
      const green = Math.round(180 + (75 * ratio)); // 180 to 255
      return `rgb(${red}, ${green}, 0)`;
    } else {
      // Yellow to green (6-10)
      const ratio = (level - 5) / 5;
      const red = Math.round(200 * (1 - ratio)); // 200 to 0 (darker yellow starting point)
      const green = 180; // Toned down green
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  // Sort tags alphabetically
  const sortedTags = [...allTags].sort();

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-slate-500 hover:text-slate-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Trust Level Filter */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">
            Minimum Trust Level
            {trustLevelFilter !== null && (
              <span 
                className="ml-2 font-semibold"
                style={{ color: getTrustLevelColor(trustLevelFilter) }}
              >
                {trustLevelFilter}+
              </span>
            )}
          </h4>
          
          <div className="space-y-3">
            <div className="px-2">
              <Slider
                value={trustLevelFilter ? [trustLevelFilter] : [1]}
                onValueChange={(value) => onTrustLevelChange(value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between text-xs text-slate-500">
              <span style={{ color: getTrustLevelColor(1) }}>Low (1)</span>
              <span style={{ color: getTrustLevelColor(10) }}>High (10)</span>
            </div>
            
            {trustLevelFilter !== null && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTrustLevelChange(null)}
                className="w-full text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Remove Filter
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Tags Filter */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">
            Filter by Tags
            {selectedTags.length > 0 && (
              <span className="ml-2 text-blue-600 font-semibold">
                ({selectedTags.length})
              </span>
            )}
          </h4>
          
          {sortedTags.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              No tags available yet
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sortedTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer w-fit text-xs transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                      : "hover:bg-slate-100"
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Active Filters
              </h4>
              <div className="space-y-1">
                {trustLevelFilter !== null && (
                  <div className="text-xs text-slate-600">
                    Trust Level: {trustLevelFilter}+
                  </div>
                )}
                {selectedTags.length > 0 && (
                  <div className="text-xs text-slate-600">
                    Tags: {selectedTags.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
