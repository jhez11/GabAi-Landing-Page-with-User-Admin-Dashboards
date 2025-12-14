const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
export const generateResponse = async (messages: {
  role: 'user' | 'system' | 'assistant';
  content: string;
}[], context?: string) => {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key is missing');
    return 'I am currently offline (API key missing).';
  }
  try {
    const systemMessage = {
      role: 'system',
      content: `You are GabAi, a helpful university assistant. ${context ? `Use this context to answer: ${context}` : ''}`
    };
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...messages],
        temperature: 0.7
      })
    });
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};
export const transcribeAudio = async (audioBlob: Blob) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is missing');
  }
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');
  try {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: formData
    });
    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};