import React from "react";

interface DatePickerProps {
  label: string;
  selectedDate: Date | null;
  setDate: (date: Date | null) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  selectedDate,
  setDate,
}) => (
  <input
    type="text"
    placeholder={label}
    value={selectedDate ? selectedDate.toDateString() : ""}
    onFocus={() => setDate(new Date())} // Placeholder action
    readOnly
    className="text-gray-600 placeholder-gray-400 focus:outline-none"
  />
);
