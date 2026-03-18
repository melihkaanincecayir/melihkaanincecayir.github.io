module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { question } = req.body;
    if (!question || !question.trim()) return res.status(400).json({ error: 'Soru boş olamaz.' });

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: `Sen Melih Kaan İnceçayır'ın kişisel portföy sitesindeki yapay zeka asistanısın. Melih Kaan, Pamukkale Üniversitesi Bilgisayar Mühendisliği 1. sınıf öğrencisi ve Manisa Celal Bayar Üniversitesi Bilgisayar Programcılığı mezunu. Bildiği teknolojiler: HTML, CSS, JavaScript, TypeScript, React, Node.js, Python, UI/UX, Figma, Git. Türkçe, samimi, kısa yanıtlar ver. Maks 3-4 cümle.` }]
                },
                contents: [{ parts: [{ text: question.trim() }] }]
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        return res.status(500).json({ error: data.error?.message || JSON.stringify(data) });
    }

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt alınamadı.';
    return res.status(200).json({ answer });
};