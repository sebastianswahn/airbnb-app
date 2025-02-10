import { Listing } from "./listing";

export interface MobileSearchBarProps {
  onSearch?: (query: string) => void;
}

export interface ListingCardProps {
  listing: Listing;
  className?: string;
}

export interface PriceToggleProps {
  showTotal: boolean;
  setShowTotal: (show: boolean) => void;
}
