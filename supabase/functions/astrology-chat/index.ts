import { serve } from 'https://deno.fresh.dev/std@0.177.0/http/server.ts';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the request is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { message } = await req.json();
    if (!message) {
      throw new Error('Missing message');
    }

    // Initialize OpenAI with the server's API key
    const openai = new OpenAIApi(new Configuration({ 
      apiKey: OPENAI_API_KEY 
    }));

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert Vedic astrologer. Provide detailed insights about astrology, birth charts, and spiritual guidance. Be specific and reference traditional texts where appropriate."
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.data.choices[0].message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }
    
    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    );
  }
});