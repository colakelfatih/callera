'use client'

import React, { useState, useEffect } from 'react'
import { Instagram, CheckCircle, Loader2, ExternalLink, MessageSquare, Mail, Phone, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

interface ConnectedAccount {
  id: string
  platform: 'instagram' | 'whatsapp' | 'email' | 'phone'
  username: string
  connectedAt: Date
  status: 'active' | 'inactive'
}

export default function IntegrationsTab() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const searchParams = useSearchParams()

  useEffect(() => {
    // Load connected accounts from API
    const fetchConnections = async () => {
      try {
        const response = await fetch('/api/integrations/instagram')
        if (response.ok) {
          const connections = await response.json()
          setConnectedAccounts(
            connections.map((conn: any) => ({
              id: conn.id,
              platform: 'instagram' as const,
              username: conn.instagramUsername,
              connectedAt: new Date(conn.createdAt),
              status: (conn.tokenExpiresAt && new Date(conn.tokenExpiresAt) > new Date() ? 'active' : 'inactive') as 'active' | 'inactive',
            }))
          )
        }
      } catch (error) {
        console.error('Failed to fetch connections:', error)
      }
    }

    // Check for success/error in URL params
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const username = searchParams.get('username')

    // Always fetch connections on mount
    fetchConnections()

    // If success, connections will be refreshed automatically
    if (success && username) {
      // Small delay to ensure database is updated
      setTimeout(() => {
        fetchConnections()
      }, 1000)
    }
  }, [searchParams])

  const handleConnectInstagram = async () => {
    setLoading(prev => ({ ...prev, instagram: true }))
    try {
      // Get current user from session
      const sessionResponse = await fetch('/api/auth/get-session')
      const session = await sessionResponse.json()
      
      if (!session?.user?.id) {
        alert('Lütfen önce giriş yapın')
        setLoading(prev => ({ ...prev, instagram: false }))
        return
      }

      // Redirect to Instagram OAuth
      window.location.href = `/api/instagram/auth?userId=${session.user.id}`
    } catch (error) {
      console.error('Failed to connect Instagram:', error)
      setLoading(prev => ({ ...prev, instagram: false }))
    }
  }

  const handleDisconnect = async (accountId: string) => {
    if (confirm('Bu hesabı bağlantısını kesmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/integrations/instagram/${accountId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setConnectedAccounts(connectedAccounts.filter(acc => acc.id !== accountId))
        } else {
          alert('Bağlantı kesilirken bir hata oluştu')
        }
      } catch (error) {
        console.error('Failed to disconnect:', error)
        alert('Bağlantı kesilirken bir hata oluştu')
      }
    }
  }

  const integrations = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      description: 'Instagram Business hesabınızı bağlayın ve gelen mesajları otomatik olarak AI ile yanıtlayın',
      gradient: 'from-purple-500 via-pink-500 to-orange-500',
      features: [
        'Instagram DM\'leri birleşik gelen kutusunda görüntüle',
        'AI destekli otomatik yanıtlar',
        'Duygu analizi ve otomatik etiketleme',
        'Gerçek zamanlı mesaj bildirimleri',
      ],
      connectHandler: handleConnectInstagram,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageSquare,
      description: 'WhatsApp Business hesabınızı bağlayın',
      gradient: 'from-green-500 to-green-600',
      features: [
        'WhatsApp mesajlarını yönet',
        'Otomatik yanıtlar',
        'Mesaj şablonları',
      ],
      connectHandler: () => alert('WhatsApp entegrasyonu yakında eklenecek'),
      comingSoon: true,
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      description: 'E-posta hesaplarınızı bağlayın',
      gradient: 'from-blue-500 to-blue-600',
      features: [
        'Tüm e-postaları tek yerde görüntüle',
        'AI destekli yanıt önerileri',
        'Otomatik kategorilendirme',
      ],
      connectHandler: () => alert('Email entegrasyonu yakında eklenecek'),
      comingSoon: true,
    },
  ]

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Entegrasyonlar</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Sosyal medya hesaplarınızı ve servislerinizi bağlayın
        </p>
      </div>

      {/* Integration Cards */}
      <div className="space-y-4">
        {integrations.map((integration) => {
          const Icon = integration.icon
          const isConnected = connectedAccounts.some(acc => acc.platform === integration.id)
          const account = connectedAccounts.find(acc => acc.platform === integration.id)
          const isLoading = loading[integration.id]

          return (
            <div
              key={integration.id}
              className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${integration.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {integration.name}
                      </h3>
                      {integration.comingSoon && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                          Yakında
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connected Account Display */}
              {isConnected && account && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${integration.gradient} rounded-full flex items-center justify-center`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          @{account.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Bağlandı: {new Date(account.connectedAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle size={16} />
                        Aktif
                      </span>
                      <button
                        onClick={() => handleDisconnect(account.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Bağlantıyı Kes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Connect Button */}
              {!isConnected && (
                <button
                  onClick={integration.connectHandler}
                  disabled={isLoading || integration.comingSoon}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${integration.gradient} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Bağlanıyor...
                    </>
                  ) : (
                    <>
                      <Icon size={20} />
                      {integration.name} Hesabını Bağla
                      <ExternalLink size={16} />
                    </>
                  )}
                </button>
              )}

              {/* Features List */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Özellikler
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {integration.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <p className="font-semibold mb-1">Önemli Notlar:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
            <li>Instagram için Business veya Creator hesabı gereklidir</li>
            <li>Bağlantılar güvenli bir şekilde saklanır ve şifrelenir</li>
            <li>İstediğiniz zaman bağlantıyı kesebilirsiniz</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

