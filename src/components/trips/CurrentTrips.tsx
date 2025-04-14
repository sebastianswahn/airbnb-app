import Image from "next/image";
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

interface CurrentTripsProps {
  trips: Booking[];
}

export default function CurrentTrips({ trips }: CurrentTripsProps) {
  const router = useRouter();

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="mb-12">
      <h2 className="text-[22px] pb-8 font-roboto font-semibold leading-[26px] text-black-600">
        Upcoming trips
      </h2>
      
      <div className="space-y-6">
        {trips.map((trip) => (
          <div 
            key={trip._id}
            className="border border-solid border-grey-600 rounded-xl overflow-hidden"
          >
            <div className="relative h-[240px] w-full">
              {trip.listing.images && trip.listing.images.length > 0 ? (
                <Image
                  src={trip.listing.images[0]}
                  alt={trip.listing.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-roboto font-semibold text-black-600">
                    {trip.listing.name || "Listing"}
                  </h3>
                  <p className="text-gray-500">
                    {trip.host ? `Hosted by ${trip.host.name}` : "Hosted by the owner"}
                  </p>
                </div>
                
                {trip.status && (
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    trip.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </div>
                )}
              </div>
              
              <div className="mt-4 pb-4 border-b border-solid border-grey-600">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Check-in</span>
                  <span>{formatDate(trip.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-out</span>
                  <span>{formatDate(trip.endDate)}</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => router.push(`/trips/${trip._id}`)}
                  className="flex-1 h-12 font-roboto flex items-center justify-center rounded-lg border border-solid border-blue-600 text-blue-600 font-semibold"
                >
                  View details
                </button>
                
                <button
                  onClick={() => router.push(`/listings/${trip.listing._id}/messages`)}
                  className="flex-1 h-12 font-roboto flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold"
                >
                  Message host
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}