# Prisma & BetterAuth Kurulum Rehberi

## 🚀 Hızlı Başlangıç

### 1. Paketleri Yükle

```bash
npm install
```

### 2. Environment Variables

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

**Önemli:** `BETTER_AUTH_SECRET` için güvenli bir random string oluşturun:
```bash
openssl rand -base64 32
```

### 3. PostgreSQL'i Başlat

```bash
# Docker Compose ile
docker-compose up -d postgres

# Veritabanının hazır olduğunu kontrol et
docker-compose ps
```

### 4. Prisma Setup

```bash
# Prisma Client oluştur
npm run db:generate

# Veritabanı şemasını oluştur (development için)
npm run db:push

# Veya migration oluştur (production için)
npm run db:migrate
```

### 5. Development Server

```bash
npm run dev
```

## 📁 Dosya Yapısı

```
prisma/
  └── schema.prisma          # Veritabanı şeması

src/
  ├── lib/
  │   ├── db.ts              # Prisma client singleton
  │   ├── auth.ts            # BetterAuth yapılandırması
  │   └── auth-helpers.ts    # Auth helper fonksiyonları
  ├── app/
  │   └── api/
  │       └── auth/
  │           ├── [...all]/route.ts    # BetterAuth API handler
  │           └── get-session/route.ts  # Session API
  └── components/
      └── auth/
          └── auth-provider.tsx        # React auth client
```

## 🔐 Authentication Kullanımı

### Client-Side

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

### Server-Side

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

// Require auth
export default async function ProtectedPage() {
  const session = await requireAuth()
  return <div>Protected content</div>
}
```

## 🗄️ Veritabanı Modelleri

- **User** - Kullanıcılar
- **Account** - BetterAuth hesapları
- **Session** - BetterAuth oturumları
- **Contact** - İletişimler
- **Conversation** - Konuşmalar
- **InstagramConnection** - Instagram bağlantıları
- **InstagramMessage** - Instagram mesajları
- **AIResponse** - AI yanıtları
- **Call** - Arama kayıtları
- **AutomationFlow** - Otomasyon akışları

## 🐳 Docker Compose

PostgreSQL container'ı otomatik olarak başlatılır:

```bash
# Tüm servisleri başlat
docker-compose up -d

# Sadece PostgreSQL
docker-compose up -d postgres

# Logları görüntüle
docker-compose logs -f postgres

# Durdur
docker-compose down

# Verileri sil (dikkatli!)
docker-compose down -v
```

## 🔧 Prisma Komutları

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

## 📝 Notlar

- Development için `db:push` kullanın (hızlı)
- Production için `db:migrate` kullanın (güvenli)
- Veritabanı şeması değiştiğinde `db:generate` çalıştırın
- BetterAuth secret'ı production'da mutlaka değiştirin

