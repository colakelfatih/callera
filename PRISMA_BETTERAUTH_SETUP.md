# Prisma & BetterAuth Entegrasyonu - Kurulum Rehberi

## ✅ Tamamlanan İşlemler

### 1. Paketler Eklendi
- ✅ `@prisma/client` - Prisma ORM client
- ✅ `prisma` - Prisma CLI (dev dependency)
- ✅ `better-auth` - Modern authentication library
- ✅ `@better-auth/react` - React hooks for BetterAuth
- ✅ `axios` - HTTP client (zaten vardı)

### 2. Prisma Schema Oluşturuldu
- ✅ Kullanıcı yönetimi (User, Account, Session, Verification)
- ✅ İletişim yönetimi (Contact, ContactTag)
- ✅ Konuşma yönetimi (Conversation, ConversationLabel)
- ✅ Instagram entegrasyonu (InstagramConnection, InstagramMessage)
- ✅ AI yanıtları (AIResponse)
- ✅ Arama kayıtları (Call)
- ✅ Otomasyon akışları (AutomationFlow, AutomationCondition, AutomationAction)

### 3. BetterAuth Yapılandırması
- ✅ Prisma adapter ile entegrasyon
- ✅ Email/Password authentication
- ✅ Session yönetimi
- ✅ API route handler (`/api/auth/[...all]`)

### 4. Docker Compose PostgreSQL
- ✅ PostgreSQL 16 container
- ✅ Health check
- ✅ Persistent volume
- ✅ Network yapılandırması
- ✅ Environment variables

### 5. Helper Functions
- ✅ `getSession()` - Server-side session alma
- ✅ `getCurrentUser()` - Current user alma
- ✅ `requireAuth()` - Authentication zorunluluğu

## 🚀 Kurulum Adımları

### Adım 1: Paketleri Yükle

```bash
npm install
```

### Adım 2: Environment Variables

`.env.local` dosyası oluşturun:

```env
# Database
DATABASE_URL="postgresql://callera:callera_password@localhost:5432/callera_db?schema=public"

# BetterAuth
BETTER_AUTH_SECRET=your-random-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Instagram (opsiyonel)
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/callback
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_verify_token

# AI Service (opsiyonel)
OPENAI_API_KEY=your_openai_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Adım 3: PostgreSQL'i Başlat

```bash
# Docker Compose ile
docker-compose up -d postgres

# Veya manuel olarak PostgreSQL kurup başlatın
```

### Adım 4: Prisma Setup

```bash
# Prisma Client oluştur
npm run db:generate

# Veritabanı şemasını oluştur (development için)
npm run db:push

# Veya migration oluştur (production için)
npm run db:migrate
```

### Adım 5: Development Server

```bash
npm run dev
```

## 📁 Oluşturulan Dosyalar

### Prisma
- `prisma/schema.prisma` - Veritabanı şeması

### Auth
- `src/lib/auth.ts` - BetterAuth yapılandırması
- `src/lib/auth-helpers.ts` - Auth helper fonksiyonları
- `src/app/api/auth/[...all]/route.ts` - BetterAuth API route
- `src/app/api/auth/get-session/route.ts` - Session API
- `src/components/auth/auth-provider.tsx` - React auth client

### Database
- `src/lib/db.ts` - Prisma client singleton

### API Routes
- `src/app/api/integrations/instagram/route.ts` - Instagram connections API
- `src/app/api/integrations/instagram/[id]/route.ts` - Delete connection API

### Docker
- `docker-compose.yml` - PostgreSQL service eklendi

## 🔧 Kullanım Örnekleri

### Client-Side Authentication

```tsx
'use client'

import { authClient } from '@/components/auth/auth-provider'

// Sign up
const handleSignUp = async () => {
  const result = await authClient.signUp.email({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
  })
}

// Sign in
const handleSignIn = async () => {
  const result = await authClient.signIn.email({
    email: 'user@example.com',
    password: 'password123',
  })
}

// Get session
const { data: session } = await authClient.getSession()
```

### Server-Side Authentication

```tsx
import { getCurrentUser, requireAuth } from '@/lib/auth-helpers'

// Get current user
export default async function MyPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return <div>Hello {user.name}</div>
}

// Require auth (throws if not authenticated)
export default async function ProtectedPage() {
  const session = await requireAuth()
  // session.user is guaranteed to exist here
}
```

### Database Operations

```tsx
import { db } from '@/lib/db'

// Create contact
const contact = await db.contact.create({
  data: {
    userId: user.id,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'lead',
  },
})

// Get Instagram connections
const connections = await db.instagramConnection.findMany({
  where: { userId: user.id },
})
```

## 🐳 Docker Compose Komutları

```bash
# Tüm servisleri başlat
docker-compose up -d

# Sadece PostgreSQL
docker-compose up -d postgres

# Development mode
docker-compose --profile dev up

# Servisleri durdur
docker-compose down

# Verileri sil (dikkatli!)
docker-compose down -v

# Logları görüntüle
docker-compose logs -f postgres
```

## 📊 Prisma Studio

Veritabanını görsel olarak yönetmek için:

```bash
npm run db:studio
```

Tarayıcıda `http://localhost:5555` açılacak.

## 🔐 BetterAuth Endpoints

- `POST /api/auth/sign-up` - Kayıt ol
- `POST /api/auth/sign-in` - Giriş yap
- `POST /api/auth/sign-out` - Çıkış yap
- `GET /api/auth/session` - Session bilgisi
- `GET /api/auth/get-session` - Custom session endpoint

## ⚠️ Önemli Notlar

1. **Production'da**:
   - `BETTER_AUTH_SECRET` mutlaka güçlü bir secret olmalı
   - `requireEmailVerification: true` yapın
   - `DATABASE_URL` güvenli bir şekilde saklanmalı

2. **Database**:
   - Migration'ları production'da dikkatli kullanın
   - Backup stratejisi oluşturun
   - Connection pooling kullanın

3. **Security**:
   - Environment variables'ları asla commit etmeyin
   - `.env.local` dosyasını `.gitignore`'a ekleyin
   - Database şifrelerini güçlü tutun

## 🐛 Troubleshooting

### Prisma Client hatası
```bash
npm run db:generate
```

### Database connection hatası
1. PostgreSQL'in çalıştığını kontrol edin: `docker-compose ps`
2. `DATABASE_URL`'in doğru olduğunu kontrol edin
3. Network bağlantısını kontrol edin

### BetterAuth hatası
1. `BETTER_AUTH_SECRET` ayarlı mı?
2. `BETTER_AUTH_URL` doğru mu?
3. Prisma schema migrate edildi mi?

