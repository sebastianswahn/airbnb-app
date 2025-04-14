"use client";

import { useRouter } from "next/navigation";

interface ViewMessagesButtonProps {
  listingId: string;
  className?: string;
}

export default function ViewMessagesButton({ listingId, className = "" }: ViewMessagesButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/listings/${listingId}/messages`);
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} border border-blue-500 text-blue-500 font-bold rounded-lg py-3 hover:bg-blue-50`}
    >
      View messages
    </button>
  );
}