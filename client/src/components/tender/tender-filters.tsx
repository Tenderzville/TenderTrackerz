import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface FilterState {
  search: string;
  categories: string[];
  locations: string[];
  status: string[];
  budgetRange: [number, number];
  deadline: string;
  sortBy: string;
}

interface TenderFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function TenderFilters({ filters, onFiltersChange, onReset }: TenderFiltersProps) {
  const categories = [
    "Construction",
    "IT Services", 
    "Consultancy",
    "Supplies",
    "Healthcare",
    "Education",
    "Transportation",
    "Security",
    "Environmental",
    "Legal Services"
  ];

  const locations = [
    "Nairobi County",
    "Mombasa County",
    "Kiambu County",
    "Machakos County",
    "Nakuru County",
    "Kisumu County",
    "Eldoret County",
    "Thika County",
    "Multi-County",
    "Nationwide"
  ];

  const statusOptions = [
    "active",
    "closed", 
    "cancelled",
    "pending"
  ];

  const deadlineOptions = [
    { label: "Next 7 days", value: "7days" },
    { label: "Next 30 days", value: "30days" },
    { label: "Next 3 months", value: "3months" },
    { label: "Any time", value: "any" }
  ];

  const sortOptions = [
    { label: "Latest First", value: "latest" },
    { label: "Deadline Soon", value: "deadline" },
    { label: "Highest Value", value: "budget_desc" },
    { label: "Lowest Value", value: "budget_asc" },
    { label: "Alphabetical", value: "title" }
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayValue = (key: 'categories' | 'locations' | 'status', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > 0) count++;
    if (filters.locations.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 100000000) count++;
    if (filters.deadline !== "any") count++;
    return count;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search tenders..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Categories */}
        <div>
          <Label>Categories</Label>
          <div className="mt-2 space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleArrayValue('categories', category)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div>
          <Label>Locations</Label>
          <div className="mt-2 space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={() => toggleArrayValue('locations', location)}
                />
                <Label htmlFor={`location-${location}`} className="text-sm">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <Label>Status</Label>
          <div className="mt-2 space-y-2">
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => toggleArrayValue('status', status)}
                />
                <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <Label>Budget Range</Label>
          <div className="mt-2 space-y-3">
            <Slider
              value={filters.budgetRange}
              onValueChange={(value) => updateFilter('budgetRange', value as [number, number])}
              min={0}
              max={100000000}
              step={1000000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-500">
              <span>{formatCurrency(filters.budgetRange[0])}</span>
              <span>{formatCurrency(filters.budgetRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Select value={filters.deadline} onValueChange={(value) => updateFilter('deadline', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select deadline" />
            </SelectTrigger>
            <SelectContent>
              {deadlineOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div>
          <Label htmlFor="sortBy">Sort By</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
