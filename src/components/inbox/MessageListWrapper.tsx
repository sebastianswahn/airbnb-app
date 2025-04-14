"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// This is a basic placeholder implementation of MessageList
// that will work even if your API is not ready yet
const MessageListWrapper: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
      
      // For testing, you can uncomment this to create dummy conversations
      /*
      setConversations([
        {
          userId: '123456',
          userName: 'John Smith',
          userImage: '/images/userempty.png',
          lastMessage: 'Hello, I\'m interested in your listing',
          lastMessageDate: new Date().toISOString(),
          unreadCount: 2
        }
      ]);
      */
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleContactHostClick = () => {
    // For testing - navigate to a sample listing
    router.push('/listings/123');
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
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <path d="M21 15a2 2 0 0 1 0 4h-4a2 2 0 0 1 0-4h4z" stroke="#CCCCCC" strokeWidth="2" strokeLinejoin="round" />
            <path d="M7 13.5V10a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v.5" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 13.5A2.5 2.5 0 0 1 7.5 11v0a2.5 2.5 0 0 1 2.5 2.5v.5h-5v-.5z" stroke="#CCCCCC" strokeWidth="2" />
            <path d="M14 13.5a2.5 2.5 0 0 1 2.5-2.5v0a2.5 2.5 0 0 1 2.5 2.5v.5h-5v-.5z" stroke="#CCCCCC" strokeWidth="2" />
          </svg>
        </div>
        <p className="text-lg text-gray-600 mb-4">You don't have any messages yet</p>
        <p className="text-gray-500 mb-6">When you book a trip or contact a host, messages will show up here.</p>
        
        <button 
          onClick={handleContactHostClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Browse listings
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {conversations.map((conversation: any) => (
        <div
          key={conversation.userId}
          className="block border-b border-grey-600 py-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => router.push(`/inbox/conversation/${conversation.userId}`)}
        >
          <div className="flex items-start">
            <div className="relative mr-4">
              <Image
                src={conversation.userImage}
                alt={conversation.userName}
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
                <h3 className="font-semibold">{conversation.userName}</h3>
                <span className="text-sm text-gray-500">
                  {formatTime(conversation.lastMessageDate)}
                </span>
              </div>
              
              <p className="text-gray-700 truncate">
                {conversation.lastMessage}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to format the time
function formatTime(dateString: string): string {
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
}

export default MessageListWrapper;