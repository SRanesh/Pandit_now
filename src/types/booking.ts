import { PanditProfile } from './auth';

export interface Booking {
  id: string;
  devoteeId: string;
  panditId: string;
  ceremony: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  panditName: string;
  devoteeName: string;
  panditEmail: string;
  panditPhone: string;
  devoteeEmail: string;
  devoteePhone: string;
  notes?: string;
  selectedOptions?: {
    languages?: string[];
    specializations?: string[];
  };
  messages?: {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}