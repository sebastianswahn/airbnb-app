import Image from "next/image";
import Link from "next/link";

export function PlaceRules() {
  return (
    <div className="px-6 pt-6 pb-8 border-t-8 border-b-8 border-solid border-grey-1100">
      <h2 className="text-[22px] leading-[26px] text-black-600 font-roboto font-semibold pb-8">
        Rules and instructions
      </h2>
      <div className="border-b border-grey-600 pb-6">
        <h3 className="text-black-600 text-base font-roboto font-extrabold pb-2">
          House rules
        </h3>
        <p className="text-base font-normal font-roboto text-black-600 pb-2">
          Self check-in with Building staff 2 guests maximum No pets
        </p>
        <button className="text-base text-black-600 font-semibold font-roboto underline">
          Show more
        </button>
      </div>
      <div className="pt-4">
        <Link
          href="/listing"
          className="text-base flex items-center justify-between font-normal font-roboto text-black-600"
        >
          <div className="flex items-center gap-2">
            <Image src="/images/print.svg" alt="Print" width={24} height={24} />
            <span>Show listing</span>
          </div>
          <Image
            src="/images/smallrightarw.svg"
            alt="Arrow"
            width={16}
            height={16}
          />
        </Link>
      </div>
    </div>
  );
}
