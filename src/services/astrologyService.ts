import { supabase } from '../lib/supabase';

class AstrologyService {
  async sendMessage(message: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('astrology-chat', {
        body: { message }
      });

      if (error) {
        throw error;
      }

      if (!data || !data.response) {
        throw new Error('Invalid response from server');
      }

      return data.response;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }
}

export const astrologyService = new AstrologyService();