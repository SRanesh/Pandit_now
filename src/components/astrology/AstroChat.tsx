import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { Button } from '../ui/Button';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export function AstroChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: "Namaste 🙏 I am your Vedic and Western Astrology Assistant. Feel free to ask questions about either tradition, birth charts, planetary positions, or seek spiritual guidance.",
    isUser: false,
    timestamp: new Date().toISOString()
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await geminiService.getAstrologyResponse(newMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : "I apologize, but I'm unable to provide insights at the moment. Please try again.",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Astrology Assistant
      </h3>

      <div 
        ref={chatRef}
        className="h-[400px] overflow-y-auto mb-4 space-y-4 p-4 border border-gray-200 rounded-lg"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.isUser
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.isUser ? 'text-orange-100' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <Loader className="w-5 h-5 animate-spin text-orange-500" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask about astrology, birth charts, or seek guidance..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className="flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Ask
        </Button>
      </form>
    </div>
  );
}