import Image from "next/image";

export function PlaceHost() {
  return (
    <div className="px-6 pt-6 pb-8 border-b-8 border-solid border-grey-1100">
      <div className="flex items-center justify-between pb-8">
        <h2 className="text-[22px] leading-[26px] text-black-600 font-roboto font-semibold">
          Hosted by John
        </h2>
        <Image
          src="/images/userempty.png"
          alt="Host"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="border-b border-grey-600 pb-6">
        <h3 className="text-black-600 text-base font-roboto font-extrabold pb-2">
          About your Host
        </h3>
        <p className="text-base font-normal font-roboto text-black-600 pb-2">
          I have a love for travelling, photography, and good food which made me
          choose India as my home and also gave me the inspiration to...
        </p>
        <button className="text-base text-black-600 font-semibold font-roboto underline">
          Show more
        </button>
      </div>
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="block">Co-host</span>
            <span className="block">Resort</span>
          </div>
          <Image
            src="/images/userempty.png"
            alt="Co-host"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
