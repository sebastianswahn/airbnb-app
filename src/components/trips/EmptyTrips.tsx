import Image from "next/image";
import Link from "next/link";

export default function EmptyTrips() {
  return (
    <div className="text-center border border-solid border-grey-600 rounded-xl p-6 pt-12">
      <div className="block pb-6">
        <Image
          src="/images/hand.svg"
          alt="No trips"
          width={48}
          height={48}
          className="mx-auto"
        />
      </div>
      <h2 className="text-lg font-roboto text-black-600 font-semibold pb-[9px]">
        No trips booked... yet!
      </h2>
      <p className="mb-4">
        Time to dust off your bags and start planning your next adventure
      </p>
      <Link
        href="/search"
        className="text-base h-12 font-roboto flex items-center justify-center rounded-lg w-full bg-blue-600 font-semibold text-white"
      >
        Start searching
      </Link>
    </div>
  );
}