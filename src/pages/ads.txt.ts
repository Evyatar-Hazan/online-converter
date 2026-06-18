const adClient = import.meta.env.PUBLIC_GOOGLE_ADSENSE_CLIENT;
const publisherId = adClient?.replace(/^ca-/, '') || 'pub-0000000000000000';

export function GET() {
  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
