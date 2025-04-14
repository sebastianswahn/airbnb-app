import Image from "next/image";
import Layout from "@/components/PageLayout";
import { InboxTabs } from "@/components/inbox/InboxTabs";
import { MessageList } from "@/components/inbox/MessageList";
import MobileNav from "@/components/MobileNav";
import { Suspense } from "react";

export default function InboxPage() {
  return (
    <>
      <Layout>
        <div className="max-w-[768px] w-full mx-auto pb-16 md:pb-0">
          <section className="pt-10 pb-[132px]">
            <div className="px-6">
              <div className="flex items-center justify-between pb-11">
                <h1 className="text-[32px] font-semibold leading-9 font-roboto text-black-600">
                  Inbox
                </h1>
                <Image
                  src="/images/inbox-icon.svg"
                  alt="Inbox"
                  width={24}
                  height={24}
                />
              </div>
              <InboxTabs />
              
              <Suspense fallback={
                <div className="py-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading messages...</p>
                </div>
              }>
                <MessageList />
              </Suspense>
            </div>
          </section>
        </div>
      </Layout>
      
      {/* Include the mobile navigation */}
      <MobileNav />
    </>
  );
}