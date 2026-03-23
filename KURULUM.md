# Vercel Deployment — Kurulum Rehberi

## Proje Yapısı
```
projen/
├── api/
│   └── chat.js          ← Vercel Edge Function (API proxy)
├── index.html           ← Portföy sitesi
└── vercel.json          ← Vercel yapılandırması
```

---

## Adım 1 — Anthropic API Anahtarı Al
1. https://console.anthropic.com adresine git
2. "API Keys" → "Create Key" ile yeni anahtar oluştur
3. Anahtarı kopyala (sk-ant-... ile başlar), bir yere kaydet

---

## Adım 2 — index.html Güncelle
`index.html` içindeki mevcut `askMelih` fonksiyonunu sil,
`askMelih_guncellenmis.js` dosyasındaki fonksiyonla değiştir.

---

## Adım 3 — GitHub'a Yükle
```bash
git init
git add .
git commit -m "Vercel AI backend eklendi"
git remote add origin https://github.com/KULLANICI/REPO.git
git push -u origin main
```

---

## Adım 4 — Vercel'e Deploy Et
1. https://vercel.com → "Add New Project"
2. GitHub reposunu seç → Import
3. **Environment Variables** bölümüne şunları ekle:

   | Key | Value |
   |-----|-------|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` (kendi anahtarın) |
   | `ALLOWED_ORIGIN` | `https://siteadın.vercel.app` |

4. "Deploy" butonuna bas — bitti!

---

## Adım 5 — Test Et
Siteni aç → Terminal (T tuşu) → `ask melih "React nedir?"` yaz

---

## Notlar
- API anahtarı sadece Vercel sunucusunda, Environment Variable olarak saklanır
- Tarayıcıya asla iletilmez — tamamen güvenli
- `ALLOWED_ORIGIN`'i kendi domain adresiyle güncelle (örn: https://melihkaan.vercel.app)
- Anthropic konsolundan aylık harcama limiti koyabilirsin
