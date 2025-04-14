"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Conversation {
  listingId: string;
  listingName: string;
  hostId: string;
  latestMessage: {
    content: string;
    createdAt: string;
    isFromUser: boolean;
  } | null;
  unreadCount: number;
  messageCount: number;
}

export function MessageList() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/inbox");
        
        if (response.status === 401) {
          router.push("/login?redirect=/inbox");
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Error fetching conversations: ${response.status}`);
        }
        
        const data = await response.json();
        setConversations(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading conversations...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-md">
          <p>Error loading messages: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="#CCCCCC" strokeWidth="2"/>
            <path d="M2 10L9.50924 14.7731C10.8768 15.6839 12.6232 15.6839 13.9908 14.7731L22 10" stroke="#CCCCCC" strokeWidth="2"/>
          </svg>
        </div>
        <p className="text-lg text-gray-600 mb-4">No messages yet</p>
        <p className="text-gray-500 mb-6">When you contact a host or book a property, your conversations will appear here.</p>
        
        <button 
          onClick={() => router.push('/')} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Browse properties
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {conversations.map((conversation) => (
        <div
          key={conversation.listingId}
          className="block border-b border-grey-600 py-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => router.push(`/listings/${conversation.listingId}/messages`)}
        >
          <div className="flex items-start">
            <div className="relative mr-4">
              <Image
                src="/images/userempty.png" // Default avatar
                alt={conversation.listingName}
                width={48}
                height={48}
                className="rounded-full"
              />
              {conversation.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{conversation.listingName}</h3>
                <span className="text-sm text-gray-500">
                  {conversation.latestMessage ? formatDate(conversation.latestMessage.createdAt) : ''}
                </span>
              </div>
              
              <p className="text-gray-700 truncate">
                {conversation.latestMessage?.content || 'No messages yet'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;