export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_TOKEN) {
    return res.status(500).json({ error: 'REPLICATE_API_TOKEN not configured' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt required' });
    }

    console.log(`[Replicate] Generating image for: "${prompt}"`);
    
    const response = await fetch('https://api.replicate.com/v1/models/google/imagen-4/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=60'
      },
      body: JSON.stringify({ input: { prompt } })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Replicate API error (${response.status}): ${data.detail || data.error || JSON.stringify(data)}`);
    }
    if (data.error) {
      throw new Error(data.error);
    }
    if (data.status !== 'succeeded') {
      throw new Error(`Prediction status: ${data.status}. ${data.error || ''}`);
    }

    const output = data.output;
    const url = Array.isArray(output) ? output[0] : output;
    
    return res.status(200).json({ url });
  } catch (error) {
    console.error('[Error]', error.message);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
}
