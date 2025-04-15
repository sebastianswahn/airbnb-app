"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { IMAGES } from "@/constants/images";

interface SearchFilter {
  location: string;
  dates: string;
  guests: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string[];
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize with URL search params if available
  const [searchFilters, setSearchFilters] = useState<SearchFilter>({
    location: searchParams?.get('location') || "",
    dates: "Any week",
    guests: parseInt(searchParams?.get('guests') || "0"),
    minPrice: searchParams?.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams?.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
  });
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Fetch location suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchFilters.location.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const response = await fetch(`/api/locations/search?q=${encodeURIComponent(searchFilters.location)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchFilters.location]);
  
  const handleSearchUpdate = (field: keyof SearchFilter, value: any) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Show suggestions when updating location
    if (field === 'location') {
      setShowSuggestions(true);
    }
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchFilters(prev => ({
      ...prev,
      location: suggestion
    }));
    setShowSuggestions(false);
  };
  
  const handleApplySearch = () => {
    // Build query string with all search params
    const queryParams = new URLSearchParams();
    if (searchFilters.location) queryParams.append('location', searchFilters.location);
    if (searchFilters.guests > 0) queryParams.append('guests', searchFilters.guests.toString());
    if (searchFilters.minPrice) queryParams.append('minPrice', searchFilters.minPrice.toString());
    if (searchFilters.maxPrice) queryParams.append('maxPrice', searchFilters.maxPrice.toString());
    
    // Navigate to map view with search params
    router.push(`/map?${queryParams.toString()}`);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <PageLayout>
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="flex items-center p-4">
          <button onClick={handleBack} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-lg font-medium">Search</h1>
        </div>
      </div>
      
      <div className="pt-16 px-4 pb-24">
        {/* Destination Input */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Where</label>
          <div className="relative">
            <input
              type="text"
              value={searchFilters.location}
              onChange={(e) => handleSearchUpdate("location", e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search destinations"
              className="w-full p-3 pl-10 border rounded-lg"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Image
                src={IMAGES.ICONS.SEARCH || "/images/search.svg"}
                alt="Search"
                width={20}
                height={20}
              />
            </div>
            
            {/* Loading indicator */}
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
              </div>
            )}
          </div>
          
          {/* Location Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="flex items-center">
                    <Image
                      src={IMAGES.ICONS.MAP || "/images/location.svg"}
                      alt="Location"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span>{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Date Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">When</label>
          <button 
            className="w-full p-3 border rounded-lg text-left flex justify-between items-center"
          >
            <span>{searchFilters.dates}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>
        
        {/* Guests Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Who</label>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>{searchFilters.guests > 0 ? `${searchFilters.guests} guests` : 'Add guests'}</span>
            <div className="flex items-center">
              <button 
                onClick={() => handleSearchUpdate("guests", Math.max(0, searchFilters.guests - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full border"
                disabled={searchFilters.guests <= 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                </svg>
              </button>
              <span className="mx-3">{searchFilters.guests}</span>
              <button 
                onClick={() => handleSearchUpdate("guests", searchFilters.guests + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price range</label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <input
                type="number"
                placeholder="Min"
                className="w-full p-3 pl-8 border rounded-lg"
                value={searchFilters.minPrice || ""}
                onChange={(e) => handleSearchUpdate("minPrice", e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <span>-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-3 pl-8 border rounded-lg"
                value={searchFilters.maxPrice || ""}
                onChange={(e) => handleSearchUpdate("maxPrice", e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t">
        <button
          onClick={handleApplySearch}
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium"
        >
          Search
        </button>
      </div>
    </PageLayout>
  );
}