# Setup Guide - Prisma & BetterAuth

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
BETTER_AUTH_SECRET=your-secret-key-here-change-in-production
BETTER_AUTH_URL=http://localhost:3000

# Instagram/Meta
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/callback
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_random_verify_token
INSTAGRAM_PAGE_ID=your_facebook_page_id

# AI Service
OPENAI_API_KEY=your_openai_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Docker Compose ile PostgreSQL Başlat

```bash
docker-compose up -d postgres
```

### 4. Prisma Migrasyonları

```bash
# Prisma Client oluştur
npm run db:generate

# Veritabanı şemasını oluştur
npm run db:push

# veya migration oluştur
npm run db:migrate
```

### 5. Development Server

```bash
npm run dev
```

## 📦 Docker Compose Kullanımı

### Tüm servisleri başlat (PostgreSQL + App)

```bash
docker-compose up -d
```

### Sadece PostgreSQL

```bash
docker-compose up -d postgres
```

### Development mode

```bash
docker-compose --profile dev up
```

### Servisleri durdur

```bash
docker-compose down
```

### Verileri sil (dikkatli!)

```bash
docker-compose down -v
```

## 🗄️ Veritabanı Yönetimi

### Prisma Studio (GUI)

```bash
npm run db:studio
```

Tarayıcıda `http://localhost:5555` adresine gidin.

### Migration oluştur

```bash
npm run db:migrate
```

### Schema'yı veritabanına push et

```bash
npm run db:push
```

## 🔐 BetterAuth Kullanımı

### Client Side

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

// Sign out
await authClient.signOut()

// Get session
const session = await authClient.getSession()
```

### Server Side

```tsx
import { getCurrentUser, requireAuth } from '@/lib/auth-helpers'

// Get current user
const user = await getCurrentUser()

// Require auth (throws if not authenticated)
const session = await requireAuth()
```

## 📝 Prisma Schema Modelleri

- **User**: Kullanıcılar
- **Account**: BetterAuth hesapları
- **Session**: BetterAuth oturumları
- **Contact**: İletişimler
- **Conversation**: Konuşmalar
- **InstagramConnection**: Instagram bağlantıları
- **InstagramMessage**: Instagram mesajları
- **AIResponse**: AI yanıtları
- **Call**: Arama kayıtları
- **AutomationFlow**: Otomasyon akışları

## 🔧 Troubleshooting

### Prisma Client hatası

```bash
npm run db:generate
```

### Veritabanı bağlantı hatası

1. PostgreSQL'in çalıştığından emin olun: `docker-compose ps`
2. DATABASE_URL'in doğru olduğunu kontrol edin
3. Veritabanının oluşturulduğundan emin olun

### BetterAuth hatası

1. BETTER_AUTH_SECRET'in ayarlandığından emin olun
2. BETTER_AUTH_URL'in doğru olduğunu kontrol edin
3. Prisma schema'nın migrate edildiğinden emin olun

