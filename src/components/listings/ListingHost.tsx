"use client";

import React, { useState } from "react";
import ViewMessagesButton from "./ViewMessagesButton";
import ContactHostModal from "./ContactHostModal";

interface ListingHostProps {
  name: string;
  image: string;
  joinedDate: string;
  hostId?: string;
  listingId?: string;
  listingName?: string;
}

// Default host ID from your MongoDB
const DEFAULT_HOST_ID = "670e4572c08a72a0b824785d";

const ListingHost: React.FC<ListingHostProps> = ({
  name,
  image,
  joinedDate,
  hostId = DEFAULT_HOST_ID,
  listingId = "",
  listingName = "this listing"
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleContactHost = () => {
    setShowModal(true);
  };

  return (
    <div className="my-20">
      <div className="flex items-center px-4 justify-between">
        <div className="flex-1">
          <h2 className="text-3xl pb-2 font-bold">Hosted by {name}</h2>
          <p className="text-md py-4 text-gray-500">{joinedDate}</p>
        </div>
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">★</span>
          <span className="text-lg">165 Reviews</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">✓</span>
          <span className="text-lg">Identity verified</span>
        </div>
      </div>
      <div className="pt-2 p-4">
        <div>
          <h3 className="font-semibold pb-2 text-xl mb-1">During your stay</h3>
          <p className="text-lg">
            Our caretaker at the property will ensure you have a memorable stay.
          </p>
        </div>
        <div className="space-y-1 py-4 text-lg">
          <p>Languages: English </p>
          <p>Response rate: 82%</p>
          <p>Response time: within a few hours</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleContactHost}
          className="w-full border border-black font-bold rounded-lg py-3 text-xl mt-2 hover:bg-gray-100"
        >
          Contact host
        </button>
        
        <ViewMessagesButton 
          listingId={listingId} 
          className="w-full text-xl mt-2"
        />
      </div>
      
      <p className="text-sm text-gray-500 pt-2">
        To protect your payment, never transfer money or communicate outside of
        the application
      </p>
      
      {/* Contact Host Modal */}
      {showModal && (
        <ContactHostModal
          listingId={listingId}
          listingName={listingName}
          hostName={name}
          hostImage={image}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ListingHost;