import React from "react";

interface GuestsPickerProps {
  guests: number;
  setGuests: (guests: number) => void;
}

export const GuestsPicker: React.FC<GuestsPickerProps> = ({
  guests,
  setGuests,
}) => (
  <input
    type="number"
    value={guests}
    onChange={(e) => setGuests(Number(e.target.value))}
    min="1"
    className="w-16 text-center text-gray-600 focus:outline-none"
  />
);
