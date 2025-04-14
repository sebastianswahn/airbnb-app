"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MessageFormProps {
  listingId: string;
}

export default function MessageForm({ listingId }: MessageFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch(`/api/conversations/listing/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        // Check for 401 Unauthorized - this is handled by the built-in auth
        if (response.status === 401) {
          // The app will handle the auth redirect, so we don't need to do anything
          return;
        }
        
        // Handle other errors
        const data = await response.json().catch(() => ({ error: "Failed to send message" }));
        throw new Error(data.error || "Failed to send message");
      }
      
      // Clear the input and refresh the page data
      setMessage("");
      router.refresh();
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "An error occurred while sending your message");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-r-lg transition ${
            isSubmitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}