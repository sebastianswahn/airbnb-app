"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ContactHostModalProps {
  listingId?: string;
  listingName?: string;
  hostName: string;
  hostImage: string;
  onClose: () => void;
}

const ContactHostModal: React.FC<ContactHostModalProps> = ({
  listingId = "",
  listingName = "this listing",
  hostName,
  hostImage,
  onClose,
}) => {
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
        // Handle 401 Unauthorized - probably need to log in
        if (response.status === 401) {
          // Your app will handle auth, so we just show a message
          throw new Error("Please log in to send messages");
        }
        
        // Handle other errors
        const data = await response.json().catch(() => ({ error: "Failed to send message" }));
        throw new Error(data.error || "Failed to send message");
      }
      
      // Success - close modal and go to messages page
      onClose();
      router.push(`/listings/${listingId}/messages`);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Contact {hostName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center mb-4">
          <img
            src={hostImage}
            alt={hostName}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <p className="font-medium">{hostName}</p>
            <p className="text-sm text-gray-500">
              Host of {listingName}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Your message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Hi ${hostName}, I'm interested in ${listingName}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSubmitting || !message.trim()}
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactHostModal;