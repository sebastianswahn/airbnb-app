// app/trips/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/PageLayout";
import { EmptyTrips } from "@/components/trips/EmptyTrips";
import { PastTrips } from "@/components/trips/PastTrips";

export default function TripsPage() {
  return (
    <Layout>
      <div className="max-w-[768px] w-full">
        <section className="pt-10 pb-16">
          <div className="px-6">
            <h1 className="text-[32px] font-semibold leading-9 font-roboto text-black-600 pb-12">
              Trips
            </h1>
            <EmptyTrips />
            <PastTrips />
          </div>
        </section>
      </div>
    </Layout>
  );
}

// components/trips/EmptyTrips.tsx
export function EmptyTrips() {
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

// components/trips/PastTrips.tsx
export function PastTrips() {
  return (
    <div>
      <h2 className="text-[22px] pb-16 font-roboto font-semibold leading-[26px] text-black-600">
        Where you've been
      </h2>
      <div className="flex items-center gap-4 border-b border-solid border-grey-600 pb-[50px]">
        <Image
          src="/images/trip-img.png"
          alt="Canacona"
          width={100}
          height={100}
          className="rounded-lg"
        />
        <div>
          <h3 className="text-base font-roboto font-semibold text-black-600">
            Canacona
          </h3>
          <p>Hosted by Mark</p>
          <p>5 Feb 2023 - 8 Feb 2023</p>
        </div>
      </div>
      <p className="mt-4">
        Can't find your reservation here?{" "}
        <Link href="/help" className="font-semibold underline">
          Visit the Help Centre
        </Link>
      </p>
    </div>
  );
}
