import { Switch } from "@headlessui/react";

interface PriceToggleProps {
  showTotal: boolean;
  setShowTotal: (show: boolean) => void;
}

export default function PriceToggle({
  showTotal,
  setShowTotal,
}: PriceToggleProps) {
  return (
    <div className="md:hidden px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        <div>
          <h3 className="font-medium">Display total price</h3>
          <p className="text-gray-500 text-sm">
            Includes all fees, before taxes
          </p>
        </div>
        <Switch
          checked={showTotal}
          onChange={setShowTotal}
          className={`${showTotal ? "bg-black" : "bg-gray-200"} 
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span
            className={`${showTotal ? "translate-x-6" : "translate-x-1"} 
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </div>
  );
}
