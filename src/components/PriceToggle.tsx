// PriceToggle.tsx
import React from "react";
import Switch from "@/components/ui/switch";

interface PriceToggleProps {
  showTotal: boolean;
  setShowTotal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PriceToggle: React.FC<PriceToggleProps> = ({
  showTotal,
  setShowTotal,
}) => {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-blue-300 p-4">
      <label htmlFor="showTotal" className="mr-2 text-sm text-gray-700">
        Show Total Price
      </label>
      <Switch showTotal={showTotal} setShowTotal={setShowTotal} />
    </div>
  );
};

export default PriceToggle;
