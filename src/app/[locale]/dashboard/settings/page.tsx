'use client'

import React, { useState, useEffect } from 'react'
import { Settings, Building2, MessageSquare, Bell, Globe, Moon, Sun, Shield, Clock, Users, X, CheckCircle, Loader2, Copy, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

type TabId = 'general' | 'business' | 'chat'

interface Tab {
  id: TabId
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general')
  const t = useTranslations('settings')

  const tabs: Tab[] = [
    { id: 'general', label: 'Genel', icon: Settings },
    { id: 'business', label: 'İşletme', icon: Building2 },
    { id: 'chat', label: 'Sohbet', icon: MessageSquare },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] px-4 md:px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'business' && <BusinessSettings />}
          {activeTab === 'chat' && <ChatSettings />}
        </div>
      </div>
    </div>
  )
}

// General Settings Tab
function GeneralSettings() {
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [language, setLanguage] = useState('tr')
  const [timezone, setTimezone] = useState('Europe/Istanbul')
  
  // 2FA States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [show2FADisableModal, setShow2FADisableModal] = useState(false)
  const [loading2FA, setLoading2FA] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [verifyError, setVerifyError] = useState('')
  const [setupStep, setSetupStep] = useState<'qr' | 'verify' | 'success'>('qr')

  // Check 2FA status on mount
  useEffect(() => {
    const check2FAStatus = async () => {
      try {
        const response = await fetch('/api/user/2fa/status')
        if (response.ok) {
          const data = await response.json()
          setTwoFactorEnabled(data.enabled)
        }
      } catch (error) {
        console.error('Failed to check 2FA status:', error)
      }
    }
    check2FAStatus()
  }, [])

  // Start 2FA setup
  const start2FASetup = async () => {
    setLoading2FA(true)
    setVerifyError('')
    setSetupStep('qr')
    
    try {
      const response = await fetch('/api/user/2fa/setup', { method: 'POST' })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup 2FA')
      }
      
      setQrCode(data.qrCode)
      setSecret(data.secret)
      setShow2FAModal(true)
    } catch (error: any) {
      alert(error.message || '2FA kurulumu başarısız')
    } finally {
      setLoading2FA(false)
    }
  }

  // Verify 2FA code and enable
  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerifyError('Lütfen 6 haneli kodu girin')
      return
    }
    
    setLoading2FA(true)
    setVerifyError('')
    
    try {
      const response = await fetch('/api/user/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }
      
      setSetupStep('success')
      setTwoFactorEnabled(true)
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShow2FAModal(false)
        setVerificationCode('')
        setSetupStep('qr')
      }, 2000)
    } catch (error: any) {
      setVerifyError(error.message || 'Doğrulama başarısız')
    } finally {
      setLoading2FA(false)
    }
  }

  // Disable 2FA
  const disable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerifyError('Lütfen 6 haneli kodu girin')
      return
    }
    
    setLoading2FA(true)
    setVerifyError('')
    
    try {
      const response = await fetch('/api/user/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to disable 2FA')
      }
      
      setTwoFactorEnabled(false)
      setShow2FADisableModal(false)
      setVerificationCode('')
      alert('2FA başarıyla devre dışı bırakıldı')
    } catch (error: any) {
      setVerifyError(error.message || 'İşlem başarısız')
    } finally {
      setLoading2FA(false)
    }
  }

  // Copy secret to clipboard
  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret)
      alert('Gizli anahtar kopyalandı!')
    }
  }

  return (
    <>
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell size={20} className="text-primary" />
            Bildirimler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-navy dark:text-white">Uygulama Bildirimleri</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yeni mesaj ve etkinlik bildirimleri alın</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-navy dark:text-white">E-posta Bildirimleri</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Önemli güncellemeleri e-posta ile alın</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe size={20} className="text-primary" />
            Dil ve Bölge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dil
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full md:w-auto min-w-[200px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Saat Dilimi
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full md:w-auto min-w-[200px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
              <option value="Europe/London">Londra (GMT+0)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield size={20} className="text-primary" />
            Güvenlik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${twoFactorEnabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Smartphone size={20} className={twoFactorEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500'} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-navy dark:text-white">İki Faktörlü Kimlik Doğrulama</p>
                  {twoFactorEnabled && (
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      <CheckCircle size={12} />
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {twoFactorEnabled 
                    ? 'Hesabınız 2FA ile korunuyor' 
                    : 'Hesabınız için ek güvenlik katmanı ekleyin'}
                </p>
              </div>
            </div>
            {twoFactorEnabled ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => {
                  setVerifyError('')
                  setVerificationCode('')
                  setShow2FADisableModal(true)
                }}
              >
                Devre Dışı Bırak
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={start2FASetup}
                disabled={loading2FA}
              >
                {loading2FA ? <Loader2 size={16} className="animate-spin" /> : 'Etkinleştir'}
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-navy dark:text-white">Şifre Değiştir</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Son değişiklik: 30 gün önce</p>
            </div>
            <Button variant="outline" size="sm">
              Değiştir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShow2FAModal(false)}>
          <div 
            className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-navy dark:text-white">
                {setupStep === 'success' ? '2FA Etkinleştirildi!' : '2FA Kurulumu'}
              </h2>
              <button
                onClick={() => setShow2FAModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {setupStep === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
                  İki Faktörlü Kimlik Doğrulama Etkinleştirildi
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hesabınız artık 2FA ile korunuyor.
                </p>
              </div>
            ) : (
              <>
                {/* Step 1: QR Code */}
                {setupStep === 'qr' && (
                  <>
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Authenticator uygulamanızla (Google Authenticator, Authy vb.) aşağıdaki QR kodunu tarayın:
                      </p>
                      
                      {qrCode && (
                        <div className="bg-white p-4 rounded-lg inline-block mb-4">
                          <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 mx-auto" />
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        QR kodu tarayamıyor musunuz? Bu kodu manuel olarak girin:
                      </p>
                      
                      {secret && (
                        <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                          <code className="text-sm font-mono text-navy dark:text-white break-all">
                            {secret}
                          </code>
                          <button
                            onClick={copySecret}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Kopyala"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => setSetupStep('verify')}
                    >
                      Devam Et
                    </Button>
                  </>
                )}

                {/* Step 2: Verify */}
                {setupStep === 'verify' && (
                  <>
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Authenticator uygulamanızdaki 6 haneli kodu girin:
                      </p>
                      
                      <input
                        type="text"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          setVerificationCode(value)
                          setVerifyError('')
                        }}
                        placeholder="000000"
                        className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-3 text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        autoFocus
                      />
                      
                      {verifyError && (
                        <p className="text-sm text-red-500 mt-2">{verifyError}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSetupStep('qr')}
                      >
                        Geri
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={verify2FA}
                        disabled={loading2FA || verificationCode.length !== 6}
                      >
                        {loading2FA ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                        Doğrula
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 2FA Disable Modal */}
      {show2FADisableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShow2FADisableModal(false)}>
          <div 
            className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-navy dark:text-white">2FA Devre Dışı Bırak</h2>
              <button
                onClick={() => setShow2FADisableModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Uyarı: 2FA'yı devre dışı bırakmak hesabınızın güvenliğini azaltır.
                </p>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Devam etmek için authenticator uygulamanızdaki 6 haneli kodu girin:
              </p>
              
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setVerificationCode(value)
                  setVerifyError('')
                }}
                placeholder="000000"
                className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-3 text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                autoFocus
              />
              
              {verifyError && (
                <p className="text-sm text-red-500 mt-2">{verifyError}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShow2FADisableModal(false)}
              >
                İptal
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={disable2FA}
                disabled={loading2FA || verificationCode.length !== 6}
              >
                {loading2FA ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                Devre Dışı Bırak
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Business Settings Tab
function BusinessSettings() {
  const [businessName, setBusinessName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')
  const [businessWebsite, setBusinessWebsite] = useState('')

  const handleSave = () => {
    // TODO: Save business settings via API
    alert('İşletme ayarları kaydedildi')
  }

  return (
    <>
      {/* Business Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 size={20} className="text-primary" />
            İşletme Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İşletme Adı
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Şirket adınız"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İşletme E-posta
              </label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="info@sirket.com"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+90 212 123 4567"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Web Sitesi
              </label>
              <input
                type="url"
                value={businessWebsite}
                onChange={(e) => setBusinessWebsite(e.target.value)}
                placeholder="https://sirket.com"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adres
            </label>
            <textarea
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="İşletme adresi"
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock size={20} className="text-primary" />
            Çalışma Saatleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, index) => (
              <div key={day} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-navy dark:text-white">{day}</span>
                <select className="flex-1 max-w-[120px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-3 py-2 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none">
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="closed">Kapalı</option>
                </select>
                <span className="text-gray-500">-</span>
                <select className="flex-1 max-w-[120px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-3 py-2 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none">
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="closed">Kapalı</option>
                </select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users size={20} className="text-primary" />
              Ekip Üyeleri
            </CardTitle>
            <Button size="sm">
              Davet Et
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Henüz ekip üyesi eklenmedi</p>
            <p className="text-xs mt-1">Ekip üyelerini davet ederek işbirliği yapabilirsiniz</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Chat Settings Tab
function ChatSettings() {
  const [autoReply, setAutoReply] = useState(true)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState('Merhaba! Size nasıl yardımcı olabilirim?')
  const [awayMessage, setAwayMessage] = useState('Şu anda müsait değiliz. En kısa sürede dönüş yapacağız.')
  const [responseDelay, setResponseDelay] = useState('instant')
  const [aiTone, setAiTone] = useState('professional')

  const handleSave = () => {
    // TODO: Save chat settings via API
    alert('Sohbet ayarları kaydedildi')
  }

  return (
    <>
      {/* Auto Reply Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare size={20} className="text-primary" />
            Otomatik Yanıt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-navy dark:text-white">Otomatik Yanıt</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gelen mesajlara otomatik yanıt gönder</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoReply}
                onChange={(e) => setAutoReply(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Karşılama Mesajı
            </label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Müşterilere gönderilecek karşılama mesajı"
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Müsait Değilken Mesajı
            </label>
            <textarea
              value={awayMessage}
              onChange={(e) => setAwayMessage(e.target.value)}
              placeholder="Çalışma saatleri dışında gönderilecek mesaj"
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="text-xl">🤖</span>
            AI Asistan Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-navy dark:text-white">AI Yanıtları</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yapay zeka ile otomatik yanıt oluştur</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AI Yanıt Tonu
            </label>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="w-full md:w-auto min-w-[200px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="professional">Profesyonel</option>
              <option value="friendly">Samimi</option>
              <option value="formal">Resmi</option>
              <option value="casual">Günlük</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Yanıt Gecikmesi
            </label>
            <select
              value={responseDelay}
              onChange={(e) => setResponseDelay(e.target.value)}
              className="w-full md:w-auto min-w-[200px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] px-4 py-2.5 text-sm text-navy dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="instant">Anında</option>
              <option value="5s">5 saniye</option>
              <option value="10s">10 saniye</option>
              <option value="30s">30 saniye</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Daha doğal bir deneyim için küçük bir gecikme ekleyebilirsiniz
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Replies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              ⚡ Hızlı Yanıtlar
            </CardTitle>
            <Button size="sm" variant="outline">
              Yeni Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { shortcut: '/merhaba', text: 'Merhaba! Size nasıl yardımcı olabilirim?' },
              { shortcut: '/fiyat', text: 'Fiyatlarımız hakkında bilgi almak için...' },
              { shortcut: '/tesekkur', text: 'Bizi tercih ettiğiniz için teşekkür ederiz!' },
            ].map((reply, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#252525] rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-primary">{reply.shortcut}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{reply.text}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                  Sil
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pb-6">
        <Button onClick={handleSave} size="lg">
          Değişiklikleri Kaydet
        </Button>
      </div>
    </>
  )
}
