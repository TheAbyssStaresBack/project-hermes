'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  author: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBoxProps {
  title?: string;
  placeholder?: string;
  onSendMessage?: (message: string) => void;
  onLoadMessages?: () => Promise<Message[]>;
  darkMode?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  title = 'Chat',
  placeholder = 'Type your message...',
  onSendMessage,
  onLoadMessages,
  darkMode = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages on component mount
  useEffect(() => {
    const loadMessages = async () => {
      if (onLoadMessages) {
        setIsLoading(true);
        try {
          const loadedMessages = await onLoadMessages();
          setMessages(loadedMessages);
        } catch (error) {
          console.error('Failed to load messages:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMessages();
  }, [onLoadMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      author: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Call the external handler
    if (onSendMessage) {
      try {
        await onSendMessage(inputValue);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`flex flex-col max-h-[calc(100vh-100px)] w-125 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Header */}
      <div
        className={`border-b px-6 py-4 ${
          darkMode
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-gray-50'
        }`}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      {/* Messages Container */}
      <div
        className={`flex-1 overflow-y-auto p-6 space-y-4 ${
          darkMode ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="flex justify-center items-center h-full text-gray-500">
            <p>No messages yet. Start a conversation!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.author === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.author === 'user'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.author === 'user'
                    ? 'text-blue-100'
                    : darkMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className={`border-t p-4 ${
          darkMode
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-gray-50'
        }`}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className={`flex-1 px-4 py-2 rounded-lg border outline-none transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isLoading || !inputValue.trim()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
