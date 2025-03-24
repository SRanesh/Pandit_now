import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { messageService } from '../services/messageService';
import { Button } from '../components/ui/Button';
import { UserAvatar } from '../components/UserAvatar';

interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface GroupedMessages {
  [bookingId: string]: {
    ceremony: string;
    date: string;
    counterpartyName: string;
    counterpartyId: string;
    messages: Message[];
    lastMessage: Message;
  };
}

export function MessagesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;
    
    try {
      const userMessages = await messageService.getMessagesForUser(user.id);
      setMessages(userMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group messages by booking
  const groupedMessages = React.useMemo(() => {
    return messages.reduce<GroupedMessages>((acc, message) => {
      if (!acc[message.bookingId]) {
        acc[message.bookingId] = {
          ceremony: 'Booking',
          date: message.timestamp,
          counterpartyName: user?.id === message.senderId ? message.recipientName : message.senderName,
          counterpartyId: user?.id === message.senderId ? message.recipientId : message.senderId,
          messages: [],
          lastMessage: message
        };
      }
      acc[message.bookingId].messages.push(message);
      if (new Date(message.timestamp) > new Date(acc[message.bookingId].lastMessage.timestamp)) {
        acc[message.bookingId].lastMessage = message;
      }
      return acc;
    }, {});
  }, [messages, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    const chat = groupedMessages[selectedChat];
    try {
      await messageService.sendMessage({
        bookingId: selectedChat,
        senderId: user.id,
        senderName: user.name,
        recipientId: chat.counterpartyId,
        recipientName: chat.counterpartyName,
        message: newMessage.trim()
      });
      
      setNewMessage('');
      loadMessages(); // Refresh messages
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="h-full flex">
      {/* Left sidebar - Chat list */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
          {Object.entries(groupedMessages)
            .sort(([,a], [,b]) => 
              new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
            )
            .map(([bookingId, chat]) => (
              <div
                key={bookingId}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === bookingId ? 'bg-orange-50' : ''
                }`}
                onClick={() => setSelectedChat(bookingId)}
              >
                <div className="flex items-center gap-3">
                  <UserAvatar 
                    user={{ 
                      id: chat.counterpartyId,
                      name: chat.counterpartyName,
                      email: '',
                      role: 'user'
                    }} 
                    size="md" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 truncate">
                        {chat.counterpartyName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Right side - Chat messages */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <UserAvatar 
                  user={{ 
                    id: groupedMessages[selectedChat].counterpartyId,
                    name: groupedMessages[selectedChat].counterpartyName,
                    email: '',
                    role: 'user'
                  }} 
                  size="md" 
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {groupedMessages[selectedChat].counterpartyName}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(groupedMessages[selectedChat].date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {groupedMessages[selectedChat].messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === user?.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <div className={`text-xs mt-1 ${
                        message.senderId === user?.id
                          ? 'text-orange-100'
                          : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a chat from the left to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}