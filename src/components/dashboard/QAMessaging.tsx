import React, { useState } from 'react';
import { MessageSquare, Send, Search, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { astrologyService } from '../../services/astrologyService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const INITIAL_MESSAGE = {
  id: '1',
  text: "Namaste 🙏 I am your Vedic Astrology Assistant. Feel free to ask questions about astrology, ceremonies, muhurat timings, or spiritual guidance.",
  isUser: false,
  timestamp: new Date().toISOString()
};

export function QAMessaging() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isOpen, setIsOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newQuestion,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewQuestion('');
    setIsLoading(true);

    try {
      const response = await astrologyService.sendMessage(newQuestion);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm unable to provide guidance at the moment. Please try again later.",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-20 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Questions & Answers</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmitQuestion} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question about ceremonies, rituals, or traditions..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <Button
            type="submit"
            disabled={isLoading || !newQuestion.trim()}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Ask
          </Button>
        </div>
      </form>

      {messages.length > 0 && (
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions and answers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-medium">{message.isUser ? 'Q' : 'A'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{message.text}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}