
export function PlaceHeader() {
  return (
    <div className="px-6 py-8">
      <div className="flex items-start pb-6 border-b border-grey-600">
        <div className="pr-[72px]">
          <span className="text-sm font-roboto text-black-600 font-semibold pb-2 block">
            Check-in
          </span>
          <h3 className="text-base font-roboto text-black-600 font-semibold">
            Sun, 5 Feb
          </h3>
          <span className="text-sm">1:00 pm</span>
        </div>
        <div className="border-l border-grey-600 pl-6">
          <span className="text-sm font-roboto text-black-600 font-semibold pb-2 block">
            Checkout
          </span>
          <h3 className="text-base font-roboto text-black-600 font-semibold">
            Wed, 8 Feb
          </h3>
          <span className="text-sm">11:00 am</span>
        </div>
      </div>
    </div>
  )
}

