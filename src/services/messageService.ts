import { localStorageService } from './localStorageService';

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

class MessageService {
  private readonly MESSAGES_KEY = 'messages';

  private getStoredMessages(): Message[] {
    const messages = localStorage.getItem(this.MESSAGES_KEY);
    return messages ? JSON.parse(messages) : [];
  }

  private setStoredMessages(messages: Message[]): void {
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  async sendMessage(messageData: {
    bookingId: string;
    senderId: string;
    senderName: string;
    recipientId: string;
    recipientName: string;
    message: string;
  }): Promise<Message> {
    const messages = this.getStoredMessages();
    
    const newMessage: Message = {
      id: Date.now().toString(),
      ...messageData,
      timestamp: new Date().toISOString(),
      read: false
    };

    messages.push(newMessage);
    this.setStoredMessages(messages);

    return newMessage;
  }

  async getMessagesForBooking(bookingId: string): Promise<Message[]> {
    const messages = this.getStoredMessages();
    return messages
      .filter(message => message.bookingId === bookingId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async getMessagesForUser(userId: string): Promise<Message[]> {
    const messages = this.getStoredMessages();
    return messages
      .filter(message => message.senderId === userId || message.recipientId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async markAsRead(messageIds: string[]): Promise<void> {
    const messages = this.getStoredMessages();
    const updatedMessages = messages.map(message => 
      messageIds.includes(message.id) ? { ...message, read: true } : message
    );
    this.setStoredMessages(updatedMessages);
  }
}

export const messageService = new MessageService();