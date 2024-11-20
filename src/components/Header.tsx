// components/Header.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [currentTab, setCurrentTab] = useState("stays");

  return (
    <header className="md:block hidden pt-5 pb-7">
      <div className="flex items-center pb-6 justify-between max-w-[1360px] px-[26px] w-full mx-auto">
        <Link
          href="/"
          className="xl:max-w-[248px] lg:max-w-[200px] max-w-[120px] w-full"
        >
          <Image src="/brand.svg" alt="Airbnb" width={102} height={32} />
        </Link>

        <nav>
          <ul className="flex space-x-6">
            {[
              { id: "stays", label: "Stays" },
              { id: "experiences", label: "Experiences" },
              { id: "online", label: "Online Experiences" },
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setCurrentTab(tab.id)}
                  className={`text-grey-700 pb-2.5 ${
                    currentTab === tab.id
                      ? "border-solid border-black border-b-[2px]"
                      : ""
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/host" className="text-black-600">
            Become a host
          </Link>

          <button aria-label="Change language">
            <Image
              src="/world-icon.svg"
              alt="Language"
              width={16}
              height={16}
            />
          </button>

          <div className="flex pl-5 py-1 pr-2 items-center gap-3 rounded-[48px] border border-solid">
            <button aria-label="Menu">
              <Image src="/hamburger.svg" alt="Menu" width={16} height={16} />
            </button>
            <div className="relative">
              <button aria-label="User profile">
                <Image src="/user.svg" alt="User" width={30} height={30} />
              </button>
              <div className="absolute top-0 right-0">
                <Image
                  src="/online-icon.svg"
                  alt="Online"
                  width={8}
                  height={8}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[48px] py-2 pl-6 shadow-3xl max-w-[720px] mx-auto w-full pr-3 border border-solid border-grey-600 bg-white">
        <div className="flex items-center justify-between">
          <button className="text-left">Where</button>
          <button className="text-left">When</button>
          <button className="text-left">Who</button>
          <button
            className="flex items-center rounded-full justify-center w-12 h-12 bg-blue-600"
            aria-label="Search"
          >
            <Image src="/search-icon.svg" alt="Search" width={16} height={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
