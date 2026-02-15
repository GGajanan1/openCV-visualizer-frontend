export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Create a new FormData object and copy the request data
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Forward the request to backend with the same body and headers
    const response = await fetch(`${process.env.BACKEND_URL}/process-image`, {
      method: 'POST',
      body: buffer,
      headers: {
        ...req.headers,
        'host': new URL(process.env.BACKEND_URL).host,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', response.status, errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
}
