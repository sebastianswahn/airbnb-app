"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import ListingCard from "@/components/listings/ListingCard"; // Add this import
import { IMAGES } from "@/constants/images";
import type { Listing } from "@/types/listing";

// Define window.google for TypeScript
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Define types for Google Maps API
interface GoogleLatLng {
  lat: number;
  lng: number;
}

interface GeocoderResult {
  geometry: {
    location: GoogleLatLng;
  };
}

export default function MapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [listView, setListView] = useState<boolean>(false);
  
  // Get search parameters
  const location = searchParams?.get('location') || '';
  const minPrice = searchParams?.get('minPrice') || '';
  const maxPrice = searchParams?.get('maxPrice') || '';
  
  useEffect(() => {
    // Load listings
    fetchListings();
    
    // Load Google Maps
    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      setMapLoaded(true);
    }
    
    return () => {
      // Clean up markers if needed
      if (markersRef.current) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = [];
      }
    };
  }, [location, minPrice, maxPrice]);
  
  // Initialize map when mapLoaded changes or listings are loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current && listings.length > 0 && !listView) {
      // Clear any existing map
      if (googleMapRef.current) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = [];
      }
      
      // Short delay to ensure everything is ready
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  }, [mapLoaded, listings, listView]);
  
  const fetchListings = async () => {
    try {
      setLoading(true);
      
      // Build query string with all search params
      const queryParams = new URLSearchParams();
      if (location) queryParams.append('location', location);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      queryParams.append('limit', '100'); // Get more listings for map view
      
      const response = await fetch(`/api/listings?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle both formats: array of listings or object with listings property
      const listingsData = Array.isArray(data) ? data : data.listings || [];
      setListings(listingsData);
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };
  
  const loadGoogleMapsScript = () => {
    window.initMap = () => {
      setMapLoaded(true);
    };
    
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  };
  
  // Create a marker with custom label
  const createMarkerWithLabel = (map: any, position: GoogleLatLng, listing: Listing) => {
    // Create the pin marker
    const marker = new window.google.maps.Marker({
      position,
      map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Red pin
        scaledSize: new window.google.maps.Size(32, 32),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(16, 32) // Anchor at bottom of pin
      },
      zIndex: 1
    });
    
    markersRef.current.push(marker);
    
    // Create a custom overlay for the price label
    class PriceLabel extends window.google.maps.OverlayView {
      private position: GoogleLatLng;
      private labelDiv: HTMLDivElement;
      private price: number;
      private listingId: string;
      
      constructor(position: GoogleLatLng, price: number, listingId: string) {
        super();
        this.position = position;
        this.price = price;
        this.listingId = listingId;
        
        // Create label div
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.backgroundColor = '#4D92FB';
        div.style.color = 'white';
        div.style.padding = '4px 8px';
        div.style.borderRadius = '20px';
        div.style.fontSize = '12px';
        div.style.fontWeight = 'bold';
        div.style.minWidth = '60px';
        div.style.textAlign = 'center';
        div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        div.style.cursor = 'pointer';
        div.style.zIndex = '1000';
        div.innerHTML = `${this.price} SEK`;
        
        // Add click event
        div.addEventListener('click', () => {
          setSelectedListingId(this.listingId);
        });
        
        this.labelDiv = div;
        
        // Add hover effect
        div.addEventListener('mouseover', () => {
          div.style.backgroundColor = '#3D82EB';
        });
        
        div.addEventListener('mouseout', () => {
          div.style.backgroundColor = '#4D92FB';
        });
        
        // Add to map
        this.setMap(map);
      }
      
      onAdd() {
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.labelDiv);
      }
      
      draw() {
        const overlayProjection = this.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(this.position);
        
        // Position 8px below the pin
        this.labelDiv.style.left = position.x - (this.labelDiv.offsetWidth / 2) + 'px';
        this.labelDiv.style.top = position.y + 8 + 'px'; // Position below the pin
      }
      
      onRemove() {
        if (this.labelDiv.parentElement) {
          this.labelDiv.parentElement.removeChild(this.labelDiv);
        }
      }
    }
    
    // Create the price label
    const label = new PriceLabel(position, listing.price, listing._id);
    markersRef.current.push(label);
    
    // Add click event to marker
    marker.addListener('click', () => {
      setSelectedListingId(listing._id);
    });
    
    return { marker, label };
  };
  
  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      return;
    }
    
    try {
      // Create map instance with default center (we'll adjust this later)
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        // Position the zoom control in the top-right corner
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_TOP
        }
      });
      
      googleMapRef.current = map;
      
      // Create bounds object
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidCoordinates = false;
      
      // Process each listing
      listings.forEach((listing: Listing, index: number) => {
        if (!listing.coordinates) {
          return;
        }
        
        // Handle coordinates in various formats
        let lat: number | undefined;
        let lng: number | undefined;
        
        const coords = listing.coordinates as any; // Type assertion to handle different formats
        
        if (typeof coords === 'string') {
          // Try to parse string format like "55.6812,12.5683"
          const parts = coords.split(',');
          lat = parseFloat(parts[0]);
          lng = parseFloat(parts[1]);
        } else {
          // Object format with latitude/longitude properties
          lat = typeof coords.latitude === 'string' 
            ? parseFloat(coords.latitude) 
            : coords.latitude;
            
          lng = typeof coords.longitude === 'string'
            ? parseFloat(coords.longitude)
            : coords.longitude;
        }
        
        if (typeof lat !== 'number' || isNaN(lat) || 
            typeof lng !== 'number' || isNaN(lng)) {
          return;
        }
        
        hasValidCoordinates = true;
        const position = { lat, lng };
        
        // Extend bounds to include this position
        bounds.extend(position);
        
        // Create marker with price label
        createMarkerWithLabel(map, position, listing);
      });
      
      // Fit map to bounds if we have any valid coordinates
      if (hasValidCoordinates) {
        // First, ensure we have a valid non-empty bounds
        if (!bounds.isEmpty()) {
          // Apply bounds to the map
          map.fitBounds(bounds);
          
          // Add a listener to adjust zoom after bounds are applied
          window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            // Always zoom out more than the default to show context
            const currentZoom = map.getZoom();
            // Set a lower zoom level for a wider view
            const targetZoom = Math.max(currentZoom - 1, 12);
            map.setZoom(targetZoom);
          });
        }
      } else {
        // Fallback: If we have a location search but no valid coordinates, geocode it
        if (location) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: location }, (results: GeocoderResult[], status: string) => {
            if (status === 'OK' && results && results[0]) {
              map.setCenter(results[0].geometry.location);
              map.setZoom(12); // City level zoom
            } else {
              // Default to a known coordinate for Copenhagen if geocoding fails
              map.setCenter({ lat: 55.6761, lng: 12.5683 });
              map.setZoom(12);
            }
          });
        } else {
          // Default to a known coordinate for Copenhagen if no location is provided
          map.setCenter({ lat: 55.6761, lng: 12.5683 });
          map.setZoom(12);
        }
      }
    } catch (error) {
      // Error handled silently
    }
  };
  
  const handleToggleView = () => {
    setListView(!listView);
  };
  
  const handleSearch = () => {
    router.push("/search");
  };
  
  const handleHomeClick = () => {
    router.push("/");
  };
  
  // If no Google Maps API key is set, provide an error message
  if (typeof process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'undefined') {
    return (
      <PageLayout>
        <div className="p-4 flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-xl font-semibold mb-4">Map Cannot Load</h2>
          <p className="text-gray-600 mb-4">
            Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
          </p>
          <button
            onClick={handleHomeClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Return to Listings
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="w-full h-screen relative">
        {/* Search Bar */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-white p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button onClick={handleHomeClick} className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button 
              onClick={handleSearch}
              className="flex-1 text-left p-2 px-4 rounded-full border border-gray-200 flex items-center gap-2"
            >
              <Image 
                src={IMAGES.ICONS.SEARCH || "/images/search-icon.svg"} 
                alt="Search" 
                width={16} 
                height={16} 
              />
              <span>{location || "Anywhere"}</span>
            </button>
          </div>
        </div>
        
        {/* Map or List View */}
        {!listView ? (
          /* Map View */
          <div 
            ref={mapRef} 
            className="w-full h-full pt-16"
            style={{ visibility: loading && !mapLoaded ? "hidden" : "visible" }}
          ></div>
        ) : (
          /* List View */
          <div className="pt-16 px-6 pb-20">
            <h2 className="text-xl font-bold mb-4">
              {location ? `Places in ${location}` : "All listings"}
            </h2>
            
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
                    onClick={() => router.push(`/listings/${listing._id}`)}
                    className="cursor-pointer"
                  >
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No listings found</p>
              </div>
            )}
          </div>
        )}
        
        {/* Loading Indicator */}
        {(loading || (!mapLoaded && !listView)) && (
          <div className="flex justify-center items-center h-full absolute inset-0 pt-16 bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Toggle View Button */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <button 
            onClick={handleToggleView}
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
          >
            {listView ? "Show map" : "Show list"}
          </button>
        </div>
        
        {/* Selected Listing Card */}
        {selectedListingId && !listView && (
          <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-md p-4 z-20">
            {listings.filter(l => l._id === selectedListingId).map(listing => (
              <Link key={listing._id} href={`/listings/${listing._id}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer">
                  <div className="flex">
                    {listing.images && listing.images[0] && (
                      <div className="w-1/3">
                        <Image 
                          src={listing.images[0]} 
                          alt={listing.name} 
                          width={120} 
                          height={120} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="w-2/3 p-3">
                      <h3 className="font-semibold text-sm">{listing.name}</h3>
                      <p className="text-gray-500 text-xs">{listing.location}</p>
                      <p className="font-medium mt-2">{listing.price} SEK night</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}