// Vercel Serverless Function — Node.js runtime
// Proxies Overpass API requests server-side to avoid browser CORS restrictions.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read body from the Node.js IncomingMessage stream
  const body: string = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => { data += chunk.toString(); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  const ENDPOINTS = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter',
  ];

  let lastError = 'No endpoints tried';

  for (const endpoint of ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 24000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'SevenDaysForDisaster/1.0',
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        lastError = `HTTP ${response.status} from ${endpoint}`;
        continue;
      }

      const data = await response.json();
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(data);
    } catch (err: unknown) {
      clearTimeout(timer);
      lastError = err instanceof Error ? err.message : String(err);
      console.error(`[overpass proxy] ${endpoint} failed:`, lastError);
    }
  }

  return res.status(502).json({ error: lastError });
}
