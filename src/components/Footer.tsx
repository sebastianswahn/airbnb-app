import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="max-w-[1360px] mx-auto flex items-center justify-between w-full px-[26px] py-4">
      <div className="flex items-center gap-4">
        <span>© {new Date().getFullYear()} Airbnb, Inc.</span>
        {["Privacy", "Terms", "Sitemap", "Company details", "Destinations"].map(
          (item) => (
            <Link key={item} href="#" className="text-grey-700">
              {item}
            </Link>
          )
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="gap-1 text-black-600 flex items-center">
          <Image
            src="/images/world-icon.svg"
            alt="Language"
            width={16}
            height={16}
          />
          English (IN)
        </button>
        <button className="text-black-600">INR</button>
        <button className="text-black-600 flex items-center gap-[6px]">
          Support & resources
          <Image src="/images/up-arw.svg" alt="Arrow" width={12} height={12} />
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around py-2">
          {[
            { name: "Explore", icon: "ftr-icon1.svg" },
            { name: "Trips", icon: "ftr-icon2.svg" },
            { name: "Inbox", icon: "ftr-icon3.svg", hasNotification: true },
            { name: "Profile", icon: "ftr-icon4.svg" },
          ].map((item) => (
            <Link key={item.name} href="#" className="text-center">
              <div className="relative">
                <Image
                  src={`/images/${item.icon}`}
                  alt={item.name}
                  width={24}
                  height={24}
                  className="mx-auto mb-[7px]"
                />
                {item.hasNotification && (
                  <Image
                    src="/images/small-box.svg"
                    alt="Notification"
                    width={8}
                    height={8}
                    className="absolute -top-1 -right-2"
                  />
                )}
              </div>
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </footer>
  );
}
