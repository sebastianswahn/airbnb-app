"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function InboxTabs() {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <div className="flex gap-4 border-b border-grey-600">
      <button
        onClick={() => setActiveTab("messages")}
        className={cn(
          "pb-[23px] relative",
          activeTab === "messages" && "border-b-[2px] border-black-600"
        )}
      >
        <span className="text-black">
          Messages
          <span className="rounded-[100px] w-[22px] h-4 inline-flex text-white items-center justify-center bg-black-600 ml-1">
            3
          </span>
        </span>
      </button>
      <button
        onClick={() => setActiveTab("notifications")}
        className={cn(
          "text-sm font-roboto font-semibold text-grey-700",
          activeTab === "notifications" && "border-b-[2px] border-black-600"
        )}
      >
        Notifications
      </button>
    </div>
  );
}
