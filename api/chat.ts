export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { messages } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY environment variable' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are a helpful assistant for Arena Tuition Classes.
      
      Details:
      - Available Subjects: Mathematics, Science, English
      - Grades: 1st to 12th
      
      Fees Structure:
      - Primary (1-5): $40/month
      - Middle (6-8): $50/month
      - High School (9-12): $70/month
      
      Location: 123 Education Lane, Knowledge City
      Contact: +1 234 567 8900
      
      Instructions:
      - Be polite and helpful.
      - Keep responses concise, similar to WhatsApp messages.
      - If asked about enrolling, guide them to visit the office.
      - Use emojis occasionally.
      `
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [systemPrompt, ...messages],
      })
    });

    if (!response.ok) {
       const errorText = await response.text();
       return new Response(JSON.stringify({ error: 'OpenAI API error', details: errorText }), {
         status: response.status,
         headers: { 'Content-Type': 'application/json' }
       });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("API Handler Error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
