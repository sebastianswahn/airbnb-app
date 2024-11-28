// app/inbox/page.tsx
import Image from "next/image";
import Layout from "@/components/PageLayout";
import { InboxTabs } from "@/components/inbox/InboxTabs";
import { MessageList } from "@/components/inbox/MessageList";

export default function InboxPage() {
  return (
    <Layout>
      <div className="max-w-[768px] w-full mx-auto">
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
            <MessageList />
          </div>
        </section>
      </div>
    </Layout>
  );
}
