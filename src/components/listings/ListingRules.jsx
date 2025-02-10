import React from "react";

const ListingRules = () => {
  return (
    <div className="space-y-6">
      {/* Cancellation Policy */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Cancellation policy</h2>
        <p className="text-lg">This reservation is non-refundable.</p>
        <p className="text-md text-gray-500">
          Review the Host's full cancellation policy which applies even if you
          cancel for illness or disruptions caused by COVID-19.
        </p>
      </div>

      {/* House Rules */}
      <div className="space-y-3">
        <h2 className="text-xl font-medium">House rules</h2>
        <div className="space-y-1 text-lg">
          <div className="flex justify-between items-center">
            <span>Check-in</span>
            <span>1:00 PM - 6:00 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Checkout before</span>
            <span>10:00 AM</span>
          </div>
          <p>9 guests maximum</p>
        </div>
      </div>

      {/* Safety & Property */}
      <div className="space-y-3">
        <h2 className="text-xl font-medium">Safety & property</h2>
        <div className="space-y-1 text-lg">
          <p>No carbon monoxide alarm</p>
          <p>No smoke alarm</p>
          <p>Security camera/recording device</p>
        </div>
      </div>

      <div className="pt-4">
        <button className="w-full text-sm py-3 text-center border-t">
          Go back
        </button>
      </div>
    </div>
  );
};

export default ListingRules;
