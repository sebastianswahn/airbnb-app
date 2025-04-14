import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Booking {
  _id: string;
  listing: {
    _id: string;
    name: string;
    images: string[];
    location: string;
  };
  host?: {
    _id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  totalPrice?: number;
  status?: string;
}

interface PastTripsProps {
  trips: Booking[];
}

export default function PastTrips({ trips }: PastTripsProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Only show first 3 trips unless "show all" is clicked
  const visibleTrips = showAll ? trips : trips.slice(0, 3);

  return (
    <div>
      <h2 className="text-[22px] pb-8 font-roboto font-semibold leading-[26px] text-black-600">
        Where you've been
      </h2>
      
      <div className="space-y-6">
        {visibleTrips.map((trip) => (
          <div 
            key={trip._id}
            className="flex items-start gap-4 border-b border-solid border-grey-600 pb-6 cursor-pointer"
            onClick={() => router.push(`/trips/${trip._id}`)}
          >
            <div className="relative h-[100px] w-[100px] flex-shrink-0">
              {trip.listing.images && trip.listing.images.length > 0 ? (
                <Image
                  src={trip.listing.images[0]}
                  alt={trip.listing.name}
                  fill
                  className="rounded-lg object-cover"
                />
              ) : (
                <Image
                  src="/images/trip-img.png"
                  alt={trip.listing.name}
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
              )}
            </div>
            
            <div>
              <h3 className="text-base font-roboto font-semibold text-black-600">
                {trip.listing.name || "Listing"}
              </h3>
              <p>{trip.host ? `Hosted by ${trip.host.name}` : "Hosted by the owner"}</p>
              <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
            </div>
          </div>
        ))}
      </div>
      
      {trips.length > 3 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 font-semibold"
          >
            {showAll ? "Show less" : `Show all past trips (${trips.length})`}
          </button>
        </div>
      )}
      
      <p className="mt-6">
        Can't find your reservation here?{" "}
        <Link href="/help" className="font-semibold underline">
          Visit the Help Centre
        </Link>
      </p>
    </div>
  );
}