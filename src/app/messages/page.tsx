"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";

// Define types for our data
interface Conversation {
  _id: string;
  listingId: string;
  listingName: string;
  listingImage: string | null;
  messageCount: number;
  lastMessage: string | null;
  lastMessageDate: string | null;
  isLastMessageFromUser: boolean;
  updatedAt: string;
  unreadCount: number;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch all conversations for the current user
  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      try {
        const response = await fetch('/api/conversations');
        
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
        } else if (response.status === 401) {
          // If unauthorized, we might want to redirect to login
          console.log("User not authenticated");
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to load conversations");
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  // Format the last message time
  const formatLastMessageTime = (dateString: string | null): string => {
    if (!dateString) return "";
    
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If message is from today
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If message is from yesterday
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise show the date
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Get the preview text of the last message
  const getMessagePreview = (message: string | null): string => {
    if (!message) return "";
    
    // Truncate message to 50 characters if needed
    if (message.length > 50) {
      return message.substring(0, 50) + "...";
    }
    
    return message;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="md:hidden">
        <MobileNav />
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8">
        <h1 className="text-2xl font-bold mb-6">Your Messages</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
            {error}
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-2">No messages yet</h2>
            <p className="text-gray-500 mb-6">You haven't sent any messages to hosts yet.</p>
            <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Explore listings
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <li key={conversation._id}>
                  <Link 
                    href={`/listings/${conversation.listingId}/messages`}
                    className="flex items-center p-4 hover:bg-gray-50 transition"
                  >
                    <div className="h-12 w-12 rounded overflow-hidden relative mr-4 flex-shrink-0">
                      {conversation.listingImage ? (
                        <img 
                          src={conversation.listingImage} 
                          alt={conversation.listingName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                          {conversation.listingName}
                        </h2>
                        {conversation.lastMessageDate && (
                          <span className="text-sm text-gray-500">
                            {formatLastMessageTime(conversation.lastMessageDate)}
                          </span>
                        )}
                      </div>
                      
                      {conversation.lastMessage && (
                        <p className="text-gray-600 truncate">
                          {conversation.isLastMessageFromUser && "You: "}
                          {getMessagePreview(conversation.lastMessage)}
                        </p>
                      )}
                      
                      {conversation.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full mt-1">
                          {conversation.unreadCount} new
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}