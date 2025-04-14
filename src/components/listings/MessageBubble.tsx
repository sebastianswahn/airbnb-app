"use client";

interface MessageBubbleProps {
  content: string;
  isFromUser: boolean;
  timestamp: string;
  senderName?: string;
}

export default function MessageBubble({
  content,
  isFromUser,
  timestamp,
  senderName,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isFromUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isFromUser
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-white border border-gray-200 rounded-tl-none"
        }`}
      >
        {!isFromUser && senderName && (
          <p className={`text-xs font-medium mb-1 ${isFromUser ? "text-white" : "text-gray-700"}`}>
            {senderName}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">{content}</p>
        <div className="flex items-center justify-between mt-1">
          <span
            className={`text-xs ${
              isFromUser ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}