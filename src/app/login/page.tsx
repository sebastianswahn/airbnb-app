import Image from "next/image";
import Link from "next/link";

const LoginSignup = () => {
  return (
    <>
      <div className="max-w-[768px] mx-auto w-full">
        <div className="border-b border-solid border-grey-1100 pb-3.5 pt-6">
          <h1 className="text-center text-base font-roboto text-black-600 font-extrabold">
            Log in or sign up
          </h1>
        </div>

        <section className="pt-10">
          <div className="px-6">
            <div className="flex items-center justify-between pb-6">
              <h2 className="text-[22px] font-semibold leading-[26px] font-roboto text-black-600">
                Welcome to Airbnb
              </h2>
            </div>

            <div>
              <div className="border rounded-lg px-0 p-4">
                <div className="relative">
                  <select className="w-full appearance-none bg-transparent">
                    <option>Sweden (+46)</option>
                    <option>United States (+1)</option>
                    <option>United Kingdom (+44)</option>
                  </select>
                  <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                    <Image
                      src="/chevron-down.svg"
                      alt="Dropdown arrow"
                      width={14}
                      height={8}
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm mt-2">
                We&apos;ll call or text you to confirm your number. Standard
                message and data rates apply.{" "}
                <Link href="/privacy" className="font-semibold underline">
                  Privacy Policy
                </Link>
              </p>

              <button className="w-full rounded-lg text-base h-12 font-roboto font-semibold text-white flex items-center justify-center bg-blue-600 mt-4">
                Continue
              </button>

              <div className="flex items-center pt-6 pb-4">
                <div className="max-w-[141px] h-[1px] w-full bg-grey-600" />
                <span className="mx-4 inline-block text-xs font-normal text-black-600 font-roboto">
                  or
                </span>
                <div className="max-w-[141px] h-[1px] w-full bg-grey-600" />
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-4">
                {[
                  { icon: "fb.svg", text: "Continue with Facebook" },
                  { icon: "google.svg", text: "Continue with Google" },
                  { icon: "apple.svg", text: "Continue with Apple" },
                  { icon: "mail.svg", text: "Continue with email" },
                ].map((provider) => (
                  <Link
                    key={provider.text}
                    href="#"
                    className="text-center text-sm gap-[53px] text-black-600 font-roboto font-semibold rounded-lg border border-black-600 flex items-center justify-start h-12 pl-6"
                  >
                    <Image
                      src={`/${provider.icon}`}
                      alt={provider.text}
                      width={24}
                      height={24}
                    />
                    {provider.text}
                  </Link>
                ))}
              </div>

              <div className="pt-11 pb-8 text-center">
                <Link
                  href="/help"
                  className="text-sm font-roboto text-black-600 font-semibold"
                >
                  Need help?
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="max-w-[1360px] mx-auto">
        <div className="flex items-center justify-between w-full px-[26px]">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Airbnb, Inc.</span>
            {[
              "Privacy",
              "Terms",
              "Sitemap",
              "Company details",
              "Destinations",
            ].map((item) => (
              <Link key={item} href="#" className="text-grey-700">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="gap-1 text-black-600 flex items-center">
              <Image
                src="/world-icon.svg"
                alt="Language"
                width={16}
                height={16}
              />
              English (IN)
            </Link>
            <Link href="#" className="text-black-600">
              INR
            </Link>
            <Link
              href="#"
              className="text-black-600 flex items-center gap-[6px]"
            >
              Support & resources
              <Image src="/up-arw.svg" alt="Arrow up" width={12} height={12} />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="flex justify-around py-2">
            {[
              { icon: "ftr-icon1.svg", label: "Explore" },
              { icon: "ftr-icon2.svg", label: "Trips" },
              { icon: "ftr-icon3.svg", label: "Inbox" },
              { icon: "ftr-icon4.svg", label: "Profile" },
            ].map((item) => (
              <Link key={item.label} href="#" className="text-center">
                <div className="relative">
                  <Image
                    src={`/${item.icon}`}
                    alt={item.label}
                    width={24}
                    height={24}
                    className="mx-auto mb-[7px]"
                  />
                  {item.label === "Inbox" && (
                    <Image
                      src="/small-box.svg"
                      alt="Notification"
                      width={8}
                      height={8}
                      className="absolute -top-1 -right-2"
                    />
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </footer>
    </>
  );
};

export default LoginSignup;
