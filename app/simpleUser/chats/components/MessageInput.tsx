// app/chat/components/MessageInput.tsx
"use client";
import React, { useState } from "react";
import { ImageIcon, Send, X, Loader2 } from "lucide-react";

interface MessageInputProps {
  selectedUser: string | null;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleTyping: (val: string) => void;
  isSendingMessage: boolean;
  handleMessageSend: (
    e: React.FormEvent<HTMLFormElement>,
    imageFile?: File | null,
  ) => Promise<void>;
  messagesLoading?: boolean;
}

const MessageInput = ({
  selectedUser,
  message,
  setMessage,
  isSendingMessage = false,
  handleMessageSend,
  messagesLoading = false,
  handleTyping,
}: MessageInputProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!message.trim() && !imageFile) || isSendingMessage || isUploading)
      return;
    setIsUploading(true);
    await handleMessageSend(e, imageFile);
    setImageFile(null);
    setIsUploading(false);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="w-full max-h-[calc(100vh-180px)] overflow-y-auto p-2 space-y-2">
          <p className="text-gray-400 text-center mt-10 sm:mt-20 text-sm sm:text-base">
            Please select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }
  if (messagesLoading) return null;

  return (
    <div className="border-t border-gray-700 bg-gray-900 p-2 sm:p-4 w-full">
      {imageFile && (
        <div className="relative w-fit mb-3">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-gray-600"
          />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-700 transition-colors"
            onClick={() => setImageFile(null)}
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 w-full min-w-0"
      >
        {" "}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          disabled={isSendingMessage || isUploading}
        >
          <ImageIcon className="w-5 h-5 text-gray-300" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.type.startsWith("image/")) {
              setImageFile(file);
            }
          }}
        />
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping(e.target.value);
          }}
          disabled={isSendingMessage || isUploading}
          className="flex-1 min-w-0 bg-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          placeholder={imageFile ? "Add a caption..." : "Type your message..."}
        />
        <button
          type="submit"
          disabled={
            (!message.trim() && !imageFile) || isSendingMessage || isUploading
          }
          className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSendingMessage || isUploading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Send className="w-5 h-5 text-white" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
