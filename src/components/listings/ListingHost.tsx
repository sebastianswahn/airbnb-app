import Image from "next/image";

interface ListingHostProps {
  name: string;
  image: string;
  joinedDate: string;
  stats?: {
    totalReviews?: number;
    responseRate?: number;
    responseTime?: string;
    isSuperhost?: boolean;
  };
  languages?: string[];
  description?: string;
}

export default function ListingHost({
  name,
  image,
  joinedDate,
  stats,
  languages,
  description,
}: ListingHostProps) {
  return (
    <div className="py-8 border-b border-grey-600">
      <div className="flex items-center justify-between pb-8">
        <h2 className="text-[22px] leading-[26px] text-black-600 font-roboto font-semibold">
          Hosted by {name}
        </h2>
        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>

      <div className="border-b border-grey-600 pb-6">
        <div className="flex gap-4 mb-4">
          {stats?.totalReviews && (
            <div className="flex items-center gap-2">
              <Image
                src="/images/star.svg"
                alt="Reviews"
                width={16}
                height={16}
              />
              <span>{stats.totalReviews} Reviews</span>
            </div>
          )}
          {stats?.isSuperhost && (
            <div className="flex items-center gap-2">
              <Image
                src="/images/badge.svg"
                alt="Superhost"
                width={16}
                height={16}
              />
              <span>Superhost</span>
            </div>
          )}
        </div>

        <p className="text-base font-normal font-roboto text-black-600 pb-4">
          Joined in {joinedDate}
        </p>

        {description && (
          <>
            <p className="text-base font-normal font-roboto text-black-600 pb-2">
              {description}
            </p>
            <button className="text-base text-black-600 font-semibold font-roboto underline">
              Show more
            </button>
          </>
        )}
      </div>

      <div className="py-4 space-y-4">
        {stats?.responseRate && (
          <div>
            <p>Response rate: {stats.responseRate}%</p>
          </div>
        )}
        {stats?.responseTime && (
          <div>
            <p>Response time: {stats.responseTime}</p>
          </div>
        )}
        {languages && languages.length > 0 && (
          <div>
            <p>Languages: {languages.join(", ")}</p>
          </div>
        )}
      </div>

      <button className="mt-6 text-base text-black-600 font-semibold font-roboto h-12 flex items-center justify-center rounded-lg border border-solid border-black-600 bg-white w-full">
        Contact host
      </button>

      <div className="flex items-center justify-between pt-5">
        <p className="text-sm text-gray-600">
          To protect your payment, never transfer money or communicate outside
          of the Airbnb website or app.
        </p>
        <Image
          src="/images/protect-icon.svg"
          alt="Protection"
          width={24}
          height={24}
        />
      </div>
    </div>
  );
}
