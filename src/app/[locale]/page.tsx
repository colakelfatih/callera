import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-1">
          <Hero />
          <Features />
        </main>
        <Footer />
      </div>
    </div>
  )
}

