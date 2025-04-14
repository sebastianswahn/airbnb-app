"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { IMAGES } from "@/constants/images";

interface ListingContactProps {
  name: string;
  image: string;
  joinedDate: string;
  hostId: string;
  listingId: string;
  listingName: string;
}

export default function ListingContact({
  name,
  image,
  joinedDate,
  hostId,
  listingId,
  listingName,
}: ListingContactProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleContactHost = async () => {
    if (!session) {
      // Redirect to login if not authenticated
      router.push("/login?callbackUrl=" + encodeURIComponent(`/listings/${listingId}`));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If authenticated, go directly to messages page
      router.push(`/listings/${listingId}/messages`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 border-t border-b border-grey-200">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden relative">
            <Image 
              src={image || IMAGES.ICONS.USER_EMPTY}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Hosted by {name}</h3>
            <p className="text-gray-500">{joinedDate}</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 md:ml-auto">
          <button
            onClick={handleContactHost}
            disabled={isSubmitting}
            className={`px-6 py-2 border border-blue-500 rounded-full text-blue-500 hover:bg-blue-50 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Contact host
          </button>
        </div>
      </div>
    </div>
  );
}