"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/PageLayout";
import MobileNav from "@/components/MobileNav";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  read: boolean;
  listingId?: string;
  listingName?: string;
}

interface ConversationData {
  messages: Message[];
  conversation: {
    participantId: string;
    participantName: string;
    participantAvatar: string | null;
  };
}

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [participantName, setParticipantName] = useState("User");
  const [participantAvatar, setParticipantAvatar] = useState("/images/userempty.png");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/messages/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverId: userId }),
        });
        
        if (response.status === 401) {
          router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Error fetching conversation: ${response.status}`);
        }
        
        const data: ConversationData = await response.json();
        
        setMessages(data.messages || []);
        
        if (data.conversation) {
          setParticipantName(data.conversation.participantName || "User");
          if (data.conversation.participantAvatar) {
            setParticipantAvatar(data.conversation.participantAvatar);
          }
        }
      } catch (err) {
        console.error("Error fetching conversation:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversation();
    
    // Set up interval to refresh messages every 30 seconds
    const intervalId = setInterval(fetchConversation, 30000);
    
    return () => clearInterval(intervalId);
  }, [userId, router]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: userId,
          content: newMessage,
        }),
      });
      
      if (response.status === 401) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Error sending message: ${response.status}`);
      }
      
      const sentMessage: Message = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Generate a placeholder name if none exists
  const displayName = participantName || `User ${userId.substring(0, 5)}`;

  return (
    <>
      <Layout>
        <div className="max-w-[768px] w-full mx-auto pb-16 md:pb-0">
          <section className="pt-10 pb-10">
            <div className="px-6">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => router.push('/inbox')} 
                  className="mr-4"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="flex items-center">
                  <Image
                    src={participantAvatar || "/images/userempty.png"}
                    alt={displayName}
                    width={36}
                    height={36}
                    className="rounded-full mr-3"
                  />
                  <h1 className="text-2xl font-semibold">{displayName}</h1>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Message history */}
                <div className="h-[500px] overflow-y-auto p-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-500">
                      Error: {error}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      // Determine if the current user is the sender
                      // (In a real app, you'd compare with the current user's ID)
                      const isOwnMessage = message.receiver === userId;
                      
                      return (
                        <div 
                          key={message._id} 
                          className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isOwnMessage && (
                            <div className="mr-3">
                              <Image
                                src={participantAvatar || "/images/userempty.png"}
                                alt={displayName}
                                width={36}
                                height={36}
                                className="rounded-full"
                              />
                            </div>
                          )}
                          
                          <div className={`max-w-[70%]`}>
                            {message.listingName && !isOwnMessage && (
                              <div className="text-xs text-gray-500 mb-1">
                                Re: {message.listingName}
                              </div>
                            )}
                            <div 
                              className={`p-3 rounded-lg ${
                                isOwnMessage 
                                  ? 'bg-blue-500 text-white rounded-tr-none' 
                                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                            <div className={`mt-1 text-xs text-gray-500 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                              {formatDate(message.createdAt)}
                            </div>
                          </div>
                          
                          {isOwnMessage && (
                            <div className="ml-3">
                              <Image
                                src="/images/userempty.png" // Use your own user avatar
                                alt="You"
                                width={36}
                                height={36}
                                className="rounded-full"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message input */}
                <div className="border-t border-gray-200 p-4">
                  <form onSubmit={sendMessage} className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
      
      {/* Include mobile navigation */}
      <MobileNav />
    </>
  );
}