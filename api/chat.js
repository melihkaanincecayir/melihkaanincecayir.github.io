export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Sadece POST kabul et
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // CORS — sadece kendi domainden gelen isteklere izin ver
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = [
    process.env.ALLOWED_ORIGIN || '',   // Vercel'de tanımlayacağız
    'http://localhost:3000',
    'http://127.0.0.1:5500',            // Live Server için
    'http://localhost:5500',
  ].filter(Boolean);

  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Soru boş olamaz.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Soru uzunluk limiti (abuse önlemi)
    if (question.length > 500) {
      return new Response(JSON.stringify({ error: 'Soru çok uzun (maks 500 karakter).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Hızlı ve ekonomik
        max_tokens: 400,
        system: `Sen Melih Kaan İnceçayır'ın kişisel portföy sitesindeki yapay zeka asistanısın.

Melih Kaan hakkında bilgiler:
- Pamukkale Üniversitesi Bilgisayar Mühendisliği 1. sınıf öğrencisi
- Manisa Celal Bayar Üniversitesi Bilgisayar Programcılığı mezunu
- Bildiği teknolojiler: HTML, CSS, JavaScript, TypeScript, React, Node.js, Python, UI/UX, Figma, Git, REST API, WebGL, Three.js, Canvas API
- E-posta: mmelihkaann@gmail.com
- GitHub: github.com/melihkaanincecayir

Kurallar:
- Türkçe yanıt ver
- Kısa, samimi ve yardımcı ol (maks 3-4 cümle)
- Konu dışı veya zararlı içerik üretme
- Gerekirse Melih ile iletişime geçmelerini öner`,
        messages: [{ role: 'user', content: question.trim() }],
      }),
    });

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.json();
      throw new Error(errData.error?.message || 'Anthropic API hatası');
    }

    const data = await anthropicRes.json();
    const answer = data.content?.[0]?.text || 'Yanıt alınamadı.';

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Sunucu hatası' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
