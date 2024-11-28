import Image from "next/image";
import Link from "next/link";

export function PlaceSupport() {
  return (
    <div className="px-6 pt-6">
      <h2 className="text-[22px] leading-[26px] text-black-600 font-roboto font-semibold pb-1">
        Get support anytime
      </h2>
      <p className="pb-6">
        If you need help, we're available 24/7 from anywhere in the world.
      </p>
      <Link
        href="/support"
        className="text-base flex items-center justify-between font-normal font-roboto text-black-600 border-b border-grey-600 pb-4"
      >
        <div className="flex items-center gap-2">
          <Image src="/images/airbnb.svg" alt="Airbnb" width={24} height={24} />
          <span>Contact Airbnb Support</span>
        </div>
        <Image
          src="/images/smallrightarw.svg"
          alt="Arrow"
          width={16}
          height={16}
        />
      </Link>
    </div>
  );
}
