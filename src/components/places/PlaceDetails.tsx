import Image from 'next/image'

export function PlaceDetails() {
  return (
    <div className="border-t-8 pt-6 border-solid border-grey-1100 pb-[50px]">
      <div className="px-6">
        <h2 className="text-[22px] text-black-600 font-roboto font-semibold pb-8">
          Reservation details
        </h2>
        <div className="flex items-center justify-between border-b border-grey-600 pb-7">
          <div>
            <h3 className="text-black-600 text-base font-roboto font-extrabold pb-2">
              Who's coming
            </h3>
            <span className="text-base font-normal font-roboto text-black-600">
              2 guests
            </span>
          </div>
          <Image src="/images/group.png" alt="Guests" width={48} height={48} />
        </div>
        <div className="border-b border-grey-600 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-black-600 text-base font-roboto font-extrabold pb-2">
                Confirmation code
              </h3>
              <span className="text-base font-normal font-roboto text-black-600">
                HM3233P8J4
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
