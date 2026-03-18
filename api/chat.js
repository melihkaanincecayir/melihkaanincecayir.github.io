module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { question } = req.body;
    if (!question || !question.trim()) return res.status(400).json({ error: 'Soru boş olamaz.' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 400,
            system: `Sen Melih Kaan İnceçayır'ın kişisel portföy sitesindeki yapay zeka asistanısın. Melih Kaan, Pamukkale Üniversitesi Bilgisayar Mühendisliği 1. sınıf öğrencisi ve Manisa Celal Bayar Üniversitesi Bilgisayar Programcılığı mezunu. Türkçe, samimi, kısa yanıtlar ver. Maks 3-4 cümle.`,
            messages: [{ role: 'user', content: question.trim() }],
        }),
    });

    const data = await response.json();

    // Anthropic'ten hata geldiyse terminale yansıt
    if (!response.ok) {
        return res.status(500).json({ error: data.error?.message || JSON.stringify(data) });
    }

    const answer = data.content?.[0]?.text || 'Yanıt alınamadı.';
    return res.status(200).json({ answer });
};