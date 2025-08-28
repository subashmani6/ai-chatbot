export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const body = req.body || {};
    const userText =
      body.content ||
      body.input ||
      (body.message && (body.message.content || body.message.text)) ||
      '';

    if (!userText) return res.status(200).json({ content: "Hi! How can I help you today?" });

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful support assistant called Wiral AI.' },
          { role: 'user', content: userText }
        ]
      })
    });

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";
    return res.status(200).json({ content: reply });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ content: "Sorry, something went wrong." });
  }
}
