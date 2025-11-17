# ✅ Prisma & BetterAuth Entegrasyonu Tamamlandı

## 🎉 Yapılan İşlemler

### 1. ✅ Prisma Kurulumu
- Prisma schema oluşturuldu (`prisma/schema.prisma`)
- Tüm modeller tanımlandı (User, Contact, Conversation, Instagram, vb.)
- Prisma Client singleton oluşturuldu (`src/lib/db.ts`)
- Package.json'a Prisma script'leri eklendi

### 2. ✅ BetterAuth Entegrasyonu
- BetterAuth yapılandırması (`src/lib/auth.ts`)
- Prisma adapter ile entegrasyon
- Email/Password authentication
- Session yönetimi
- Auth helper fonksiyonları (`src/lib/auth-helpers.ts`)
- React auth client (`src/components/auth/auth-provider.tsx`)
- API route handler (`/api/auth/[...all]`)

### 3. ✅ Docker Compose PostgreSQL
- PostgreSQL 16 container eklendi
- Health check yapılandırıldı
- Persistent volume
- Network yapılandırması
- Environment variables

### 4. ✅ Instagram Entegrasyonu Veritabanına Bağlandı
- Instagram bağlantıları veritabanına kaydediliyor
- Mesajlar veritabanına kaydediliyor
- AI yanıtları veritabanına kaydediliyor
- API endpoint'leri oluşturuldu

## 🚀 Hızlı Başlangıç

### 1. Environment Variables

`.env.local` dosyası oluşturun:

```env
# Database
DATABASE_URL="postgresql://callera:callera_password@localhost:5432/callera_db?schema=public"

# BetterAuth
BETTER_AUTH_SECRET=your-random-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Instagram (opsiyonel)
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/callback
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_verify_token
INSTAGRAM_PAGE_ID=your_page_id

# AI Service (opsiyonel)
OPENAI_API_KEY=your_openai_key
```

**Önemli:** `BETTER_AUTH_SECRET` oluşturun:
```bash
openssl rand -base64 32
```

### 2. PostgreSQL'i Başlat

```bash
docker-compose up -d postgres
```

### 3. Prisma Setup

```bash
# Prisma Client oluştur
npm run db:generate

# Veritabanı şemasını oluştur
npm run db:push
```

### 4. Development Server

```bash
npm run dev
```

## 📁 Oluşturulan/Güncellenen Dosyalar

### Prisma
- ✅ `prisma/schema.prisma` - Veritabanı şeması

### Auth
- ✅ `src/lib/auth.ts` - BetterAuth yapılandırması
- ✅ `src/lib/auth-helpers.ts` - Auth helper fonksiyonları
- ✅ `src/app/api/auth/[...all]/route.ts` - BetterAuth API route
- ✅ `src/app/api/auth/get-session/route.ts` - Session API
- ✅ `src/components/auth/auth-provider.tsx` - React auth client

### Database
- ✅ `src/lib/db.ts` - Prisma client singleton

### Instagram API
- ✅ `src/app/api/integrations/instagram/route.ts` - GET connections
- ✅ `src/app/api/integrations/instagram/[id]/route.ts` - DELETE connection
- ✅ `src/app/api/instagram/callback/route.ts` - Veritabanına kaydetme eklendi
- ✅ `src/app/api/instagram/webhook/route.ts` - Veritabanına kaydetme eklendi

### UI
- ✅ `src/app/[locale]/layout.tsx` - AuthProvider eklendi
- ✅ `src/app/[locale]/dashboard/settings/integrations-tab.tsx` - API entegrasyonu

### Docker
- ✅ `docker-compose.yml` - PostgreSQL service

## 🔧 Kullanım

### Authentication

**Client-Side:**
```tsx
import { authClient } from '@/components/auth/auth-provider'

// Sign up
await authClient.signUp.email({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
})

// Sign in
await authClient.signIn.email({
  email: 'user@example.com',
  password: 'password123',
})

// Get session
const { data: session } = await authClient.getSession()
```

**Server-Side:**
```tsx
import { getCurrentUser, requireAuth } from '@/lib/auth-helpers'

const user = await getCurrentUser()
const session = await requireAuth()
```

### Instagram Entegrasyonu

1. Settings > Integrations sekmesine git
2. "Instagram Hesabını Bağla" butonuna tıkla
3. Instagram OAuth'da izin ver
4. Bağlantı otomatik olarak veritabanına kaydedilir
5. Gelen mesajlar webhook ile alınır ve AI ile yanıtlanır

## 🗄️ Veritabanı Modelleri

- **User** - Kullanıcılar
- **Account** - BetterAuth hesapları
- **Session** - BetterAuth oturumları
- **Verification** - Email doğrulama
- **Contact** - İletişimler
- **ContactTag** - İletişim etiketleri
- **Conversation** - Konuşmalar
- **ConversationLabel** - Konuşma etiketleri
- **InstagramConnection** - Instagram bağlantıları
- **InstagramMessage** - Instagram mesajları
- **AIResponse** - AI yanıtları
- **Call** - Arama kayıtları
- **AutomationFlow** - Otomasyon akışları
- **AutomationCondition** - Otomasyon koşulları
- **AutomationAction** - Otomasyon eylemleri

## 🐳 Docker Compose Komutları

```bash
# Tüm servisleri başlat
docker-compose up -d

# Sadece PostgreSQL
docker-compose up -d postgres

# Development mode
docker-compose --profile dev up callera-dev

# Logları görüntüle
docker-compose logs -f postgres

# Durdur
docker-compose down

# Verileri sil (dikkatli!)
docker-compose down -v
```

## 📝 Prisma Komutları

```bash
# Client generate
npm run db:generate

# Development: Schema'yı DB'ye push et
npm run db:push

# Production: Migration oluştur
npm run db:migrate

# Prisma Studio (GUI)
npm run db:studio
```

## ✅ Sonraki Adımlar

1. **Login/Register Sayfaları Oluştur**
   - `/login` ve `/register` sayfaları
   - BetterAuth ile entegre

2. **Protected Routes**
   - Dashboard sayfalarını koruma altına al
   - `requireAuth()` kullan

3. **User Profile**
   - Kullanıcı profil sayfası
   - Avatar yükleme

4. **Instagram Webhook Test**
   - Webhook URL'ini Meta'ya kaydet
   - Test mesajları gönder

5. **AI Service Entegrasyonu**
   - OpenAI veya Anthropic entegrasyonu
   - `src/lib/ai/response-generator.ts` dosyasını güncelle

## 🔐 Güvenlik Notları

- ✅ BetterAuth secret production'da mutlaka değiştirin
- ✅ Database şifrelerini güvenli tutun
- ✅ Instagram access token'ları şifreleyin
- ✅ Webhook signature doğrulaması aktif
- ✅ Rate limiting ekleyin (production için)

## 📚 Dokümantasyon

- [Prisma Docs](https://www.prisma.io/docs)
- [BetterAuth Docs](https://www.better-auth.com/docs)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)

