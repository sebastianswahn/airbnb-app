// components/SearchBar.tsx
import React, { useState } from "react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import { DatePicker } from "./Date-Picker";
import { GuestsPicker } from "./GuestPicker";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [showExtras, setShowExtras] = useState(false);

  const handleSearch = () => {
    const fullQuery = {
      query,
      checkIn,
      checkOut,
      guests,
    };
    onSearch(JSON.stringify(fullQuery));
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col space-y-2 border rounded-full shadow-lg px-4 py-2 bg-white">
      <div className="flex items-center">
        <button
          onClick={handleSearch}
          className="flex items-center justify-center  text-slate-500 p-2 rounded-full hover:bg-red-600 transition-colors ml-2"
        >
          <FaSearch className="text-lg" />
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Where are you going?"
          className="flex-1 p-2 text-gray-600 placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={() => setShowExtras(!showExtras)}
          className="text-gray-500 hover:text-gray-700 ml-2"
          aria-label="Toggle extra search options"
        >
          <FaSlidersH size={20} />
        </button>
      </div>

      {/* Extra Fields for Date and Guests */}
      {showExtras && (
        <div className="flex flex-col space-y-2 mt-2">
          <div className="flex items-center space-x-2">
            <DatePicker
              label="Check-in"
              selectedDate={checkIn}
              setDate={setCheckIn}
            />
            <DatePicker
              label="Check-out"
              selectedDate={checkOut}
              setDate={setCheckOut}
            />
          </div>
          <GuestsPicker guests={guests} setGuests={setGuests} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
