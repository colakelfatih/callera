# Instagram Entegrasyonu - Mimari ve Uygulama Planı

## 📋 Genel Bakış

Instagram hesaplarını bağlayıp gelen mesajları yapay zekaya cevaplatmak için gereken mimari ve implementasyon planı.

## 🏗️ Mimari

### 1. Teknoloji Stack
- **Instagram Graph API**: Business/Creator hesapları için DM desteği
- **Next.js API Routes**: Backend endpoint'leri
- **Webhook System**: Gerçek zamanlı mesaj alımı
- **AI Service**: OpenAI veya benzeri AI servisi
- **Database**: Instagram bağlantıları ve mesajları saklamak için

### 2. Akış Diyagramı

```
Instagram Kullanıcısı → Instagram DM → Webhook → API Route → AI Service → Instagram API → Kullanıcıya Yanıt
```

## 🔧 Adım Adım Implementasyon

### Adım 1: Instagram App Oluşturma

1. **Meta for Developers**'a git: https://developers.facebook.com/
2. Yeni bir uygulama oluştur
3. **Instagram Graph API**'yi ekle
4. Gerekli izinler:
   - `instagram_basic`
   - `instagram_manage_messages`
   - `pages_messaging`
   - `pages_read_engagement`

### Adım 2: OAuth Akışı

1. Kullanıcı "Instagram Bağla" butonuna tıklar
2. Instagram OAuth sayfasına yönlendirilir
3. İzin verildikten sonra callback URL'e döner
4. Access token alınır ve veritabanına kaydedilir

### Adım 3: Webhook Kurulumu

1. Webhook endpoint oluştur (`/api/webhooks/instagram`)
2. Meta'ya webhook URL'i kaydet
3. Webhook doğrulama (GET request)
4. Mesaj event'lerini dinle (POST request)

### Adım 4: AI Entegrasyonu

1. Gelen mesajı analiz et
2. AI servisine gönder
3. Yanıt oluştur
4. Instagram'a gönder

## 📁 Dosya Yapısı

```
src/
├── app/
│   ├── api/
│   │   ├── instagram/
│   │   │   ├── auth/
│   │   │   │   └── route.ts          # OAuth başlatma
│   │   │   ├── callback/
│   │   │   │   └── route.ts          # OAuth callback
│   │   │   ├── webhook/
│   │   │   │   └── route.ts          # Webhook handler
│   │   │   └── send-message/
│   │   │       └── route.ts          # Mesaj gönderme
│   │   └── ai/
│   │       └── generate-response/
│   │           └── route.ts          # AI yanıt oluşturma
│   └── [locale]/
│       └── dashboard/
│           └── settings/
│               └── integrations/
│                   └── page.tsx       # Entegrasyonlar sayfası
├── lib/
│   ├── instagram/
│   │   ├── client.ts                 # Instagram API client
│   │   ├── webhook.ts                # Webhook utilities
│   │   └── types.ts                  # TypeScript types
│   └── ai/
│       └── response-generator.ts     # AI yanıt generator
└── types/
    └── instagram.ts                  # Instagram types
```

## 🔐 Environment Variables

```env
# Instagram/Meta
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/instagram/callback
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_random_verify_token

# AI Service
OPENAI_API_KEY=your_openai_key
# veya
ANTHROPIC_API_KEY=your_anthropic_key

# Database (eğer kullanıyorsanız)
DATABASE_URL=your_database_url
```

## 📝 API Endpoints

### 1. OAuth Başlatma
```
GET /api/instagram/auth
```
Instagram OAuth sayfasına yönlendirir.

### 2. OAuth Callback
```
GET /api/instagram/callback?code=xxx
```
Instagram'dan dönen authorization code'u access token'a çevirir.

### 3. Webhook
```
GET /api/instagram/webhook?hub.mode=subscribe&hub.verify_token=xxx
POST /api/instagram/webhook
```
Webhook doğrulama ve mesaj event'lerini alır.

### 4. Mesaj Gönderme
```
POST /api/instagram/send-message
Body: { instagramUserId, message }
```

### 5. AI Yanıt Oluşturma
```
POST /api/ai/generate-response
Body: { message, context }
```

## 🗄️ Veritabanı Şeması (Örnek)

```sql
-- Instagram bağlantıları
CREATE TABLE instagram_connections (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  instagram_user_id VARCHAR(255) NOT NULL,
  instagram_username VARCHAR(255),
  access_token TEXT NOT NULL,
  token_expires_at TIMESTAMP,
  page_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Instagram mesajları
CREATE TABLE instagram_messages (
  id UUID PRIMARY KEY,
  connection_id UUID REFERENCES instagram_connections(id),
  instagram_message_id VARCHAR(255) UNIQUE NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  sender_username VARCHAR(255),
  message_text TEXT,
  is_from_business BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI yanıtları
CREATE TABLE ai_responses (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES instagram_messages(id),
  original_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  model_used VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Uygulama Adımları

### 1. Gerekli Paketleri Yükle

```bash
npm install axios openai
# veya
npm install axios @anthropic-ai/sdk
```

### 2. Instagram API Client Oluştur

`src/lib/instagram/client.ts` dosyasını oluştur.

### 3. Webhook Handler Oluştur

`src/app/api/instagram/webhook/route.ts` dosyasını oluştur.

### 4. AI Response Generator

`src/lib/ai/response-generator.ts` dosyasını oluştur.

### 5. Settings Sayfasına Entegrasyonlar Sekmesi Ekle

Instagram bağlantı butonu ve bağlı hesapları göster.

## ⚠️ Önemli Notlar

1. **Rate Limiting**: Instagram API rate limit'lerine dikkat edin
2. **Token Refresh**: Access token'ları düzenli olarak yenileyin
3. **Webhook Security**: Webhook doğrulamasını mutlaka yapın
4. **Error Handling**: Tüm API çağrılarında error handling ekleyin
5. **Privacy**: Kullanıcı verilerini güvenli saklayın

## 📚 Kaynaklar

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Instagram Messaging API](https://developers.facebook.com/docs/instagram-platform/instagram-messaging)
- [Webhooks Guide](https://developers.facebook.com/docs/graph-api/webhooks)

