"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";

// Define types for our message data
interface Message {
  _id?: string;
  content: string;
  userId: string;
  userName: string;
  isFromUser: boolean;
  createdAt: string;
  read: boolean;
}

interface MessageData {
  _id: string | null;
  listingId: string;
  listingName: string;
  userId: string;
  userName: string;
  messages: Message[];
}

interface Listing {
  _id: string;
  name: string;
  images: string[];
  [key: string]: any;
}

export default function MessagesPage() {
  const { id: listingId } = useParams() as { id: string };
  const [listing, setListing] = useState<Listing | null>(null);
  const [messageData, setMessageData] = useState<MessageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);

  // Fetch listing data
  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`/api/listings/${listingId}`);
        if (response.ok) {
          const data = await response.json();
          setListing(data);
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    }

    fetchListing();
  }, [listingId]);

  // Fetch messages
  async function fetchMessages() {
    setLoading(true);
    try {
      const response = await fetch(`/api/conversations/listing/${listingId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched messages:", data);
        setMessageData(data);
      } else if (response.status !== 401) {
        // Only set error for non-auth failures
        const errorData = await response.json();
        setError(errorData.error || "Failed to load messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  // Initial fetch of messages
  useEffect(() => {
    fetchMessages();
    
    // Set up polling for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [listingId]);

  // Send a message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    setSendingMessage(true);
    
    try {
      const response = await fetch(`/api/conversations/listing/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });
      
      if (response.ok) {
        setMessageText("");
        // Fetch updated messages
        fetchMessages();
      } else {
        const errorData = await response.json();
        console.error("Error sending message:", errorData);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Format date to show as "Today" or date
  const formatMessageDate = (dateString: string): string => {
    const messageDate = new Date(dateString);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Default values
  const listingName = listing?.name || "Listing";
  const listingImage = listing?.images && listing.images.length > 0 
    ? listing.images[0] 
    : "/placeholder-listing.jpg";

  return (
    <div className="min-h-screen bg-white">
      <div className="md:hidden">
        <MobileNav />
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8">
        <div className="mb-6 flex items-center">
          <Link href="/messages" className="mr-2 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <p className="text-gray-600 mb-4">
          Conversation about {listingName}
        </p>

        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          {/* Header with listing info */}
          <div className="p-4 border-b border-gray-200 flex items-center">
            <div className="h-12 w-12 rounded overflow-hidden relative mr-4">
              <img 
                src={listingImage}
                alt={listingName}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{listingName}</h2>
              <p className="text-sm text-gray-500">Your messages about this listing</p>
            </div>
          </div>

          {/* Message container */}
          <div className="p-4 h-96 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-red-500">
                <p>{error}</p>
              </div>
            ) : messageData?.messages && messageData.messages.length > 0 ? (
              messageData.messages.map((message, index) => (
                <div 
                  key={message._id || index}
                  className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.isFromUser
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    {!message.isFromUser && (
                      <p className={`text-xs font-medium mb-1 ${message.isFromUser ? "text-white" : "text-gray-700"}`}>
                        {message.userName}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-xs ${
                          message.isFromUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatMessageDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="mb-2">No messages yet</p>
                <p className="text-sm">Start a conversation about this listing</p>
              </div>
            )}
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={sendMessage}>
              <div className="flex">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-r-lg transition ${
                    sendingMessage
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  disabled={sendingMessage}
                >
                  {sendingMessage ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Response times may vary. Please allow the host up to 24 hours to respond.</p>
        </div>
      </div>
    </div>
  );
}