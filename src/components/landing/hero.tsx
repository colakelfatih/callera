'use client'

import { Button } from '@/components/ui/button'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

// Channel Icons
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

export function Hero() {
  const t = useTranslations('landing.hero')
  const params = useParams()
  const locale = params.locale as string

  const channels = [
    { icon: WhatsAppIcon, name: 'WhatsApp', color: 'bg-green-500' },
    { icon: TelegramIcon, name: 'Telegram', color: 'bg-blue-500' },
    { icon: InstagramIcon, name: 'Instagram', color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500' },
    { icon: Mail, name: 'E-posta', color: 'bg-red-500' },
    { icon: Phone, name: 'Telefon', color: 'bg-navy' },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-24 xl:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-6 sm:gap-8 text-center lg:text-left">
          <div className="flex flex-col gap-3 sm:gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter text-navy dark:text-white">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-navy/70 dark:text-gray-400">
              {t('subtitle')}
            </p>
          </div>

          {/* Channel Icons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {channels.map((channel, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-navy-800 rounded-full"
              >
                <div className={`w-6 h-6 ${channel.color} rounded-full flex items-center justify-center`}>
                  <channel.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-medium text-navy dark:text-white">{channel.name}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
            <a href={`/${locale}/register`}>
              <Button size="lg" className="w-full sm:w-auto">
                {t('requestDemo')}
              </Button>
            </a>
            <a href={`/${locale}/register`}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                {t('tryFree')}
              </Button>
            </a>
          </div>

          <div className="mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 text-center lg:text-left">
              {t('trustedBy')}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 sm:gap-x-8 gap-y-3">
              <div className="text-gray-400 dark:text-gray-500 font-semibold text-sm">TechStore</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold text-sm">ModaHouse</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold text-sm">AutoParts</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold text-sm">FoodDelivery</div>
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-[4/3] lg:aspect-square">
          <div className="absolute w-full h-full" style={{ perspective: '1000px' }}>
            {/* Unified Inbox Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[75%] lg:w-[90%] xl:w-[85%] transform transition-transform duration-500 ease-in-out"
              style={{ transform: 'rotateY(-10deg) rotateX(10deg) translateZ(50px)' }}>
              <div className="relative w-full bg-white dark:bg-navy rounded-xl shadow-2xl overflow-hidden p-2 sm:p-3 lg:p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-navy-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="block w-3 h-3 bg-red-400 rounded-full"></span>
                    <span className="block w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span className="block w-3 h-3 bg-green-400 rounded-full"></span>
                  </div>
                  <div className="text-xs font-semibold text-gray-500">Cevaplıyoruz</div>
                  <div></div>
                </div>

                <div className="mt-4 space-y-3">
                  {/* WhatsApp Message */}
                  <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-sm text-navy dark:text-white">Ahmet Yılmaz</p>
                        <p className="text-xs text-gray-400">10:32</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Ürün hakkında bilgi almak istiyorum...</p>
                    </div>
                  </div>

                  {/* Instagram Message */}
                  <div className="flex items-start gap-2 p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-pink-500">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 flex items-center justify-center">
                      <InstagramIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-sm text-navy dark:text-white">@merve_style</p>
                        <p className="text-xs text-gray-400">09:45</p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Bu ürün hâlâ stokta mı?</p>
                    </div>
                  </div>

                  {/* Telegram Message */}
                  <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <TelegramIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-sm text-navy dark:text-white">Can Demir</p>
                        <p className="text-xs text-gray-400">09:15</p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Kargo takip numarasını alabilir miyim?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Calling Mockup */}
            <div className="absolute bottom-[-10%] right-[-10%] sm:bottom-[-8%] sm:right-[-8%] md:bottom-[-5%] md:right-[-5%] lg:bottom-[-10%] lg:right-[-5%] w-[60%] sm:w-[55%] md:w-[50%] lg:w-[55%] bg-white dark:bg-navy rounded-xl shadow-2xl p-2 sm:p-3 lg:p-4 border border-gray-200 dark:border-gray-700 transition-transform duration-500 ease-in-out hover:scale-105"
              style={{ transform: 'rotateY(15deg) rotateX(-5deg) translateZ(100px)' }}>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-primary">AI ARAMA</p>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-navy dark:text-white">Selin Kaya aranıyor...</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">00:12</p>
                </div>
              </div>

              <div className="mt-4 flex gap-1 h-8 items-end">
                {[...Array(11)].map((_, i) => (
                  <span
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{ 
                      height: `${Math.random() * 80 + 20}%`,
                      animationDelay: `${i * 100}ms`
                    }}
                  ></span>
                ))}
              </div>
            </div>

            {/* AI Response Bubble */}
            <div className="absolute top-[5%] right-[5%] sm:top-[10%] sm:right-[10%] w-[45%] sm:w-[40%] bg-primary text-white rounded-xl p-3 shadow-lg"
              style={{ transform: 'rotateY(5deg) rotateX(-5deg) translateZ(80px)' }}>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-bold">AI Yanıt</span>
              </div>
              <p className="text-xs leading-relaxed">
                "Merhaba! Ürünümüz şu an stokta ve hemen kargoya verebiliriz. 🎉"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
