// Vercel Serverless Function — proxies Overpass API requests to avoid CORS
// The browser calls /api/overpass (same origin), and this function forwards to Overpass server-side.

export async function POST({ request }: { request: Request }): Promise<Response> {
  try {
    const body = await request.text();

    // Try the faster endpoint first
    const endpoints = [
      'https://overpass.kumi.systems/api/interpreter',
      'https://overpass-api.de/api/interpreter',
    ];

    let lastError: string | null = null;

    for (const endpoint of endpoints) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'SevenDaysForDisaster/1.0 (Vercel Serverless)',
          },
          body,
          signal: controller.signal,
        });

        if (!response.ok) {
          lastError = `HTTP ${response.status} from ${endpoint}`;
          continue;
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      } finally {
        clearTimeout(timeout);
      }
    }

    return new Response(
      JSON.stringify({ error: lastError || 'All endpoints failed' }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
