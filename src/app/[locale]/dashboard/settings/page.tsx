'use client'

import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Building2, 
  CreditCard, 
  Bell, 
  Shield, 
  Monitor, 
  Globe, 
  Smartphone, 
  Key,
  X, 
  CheckCircle, 
  Loader2, 
  Copy,
  Info,
  LogOut,
  Trash2,
  RefreshCw,
  Clock,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

type SettingsTab = 'general' | 'business' | 'billing' | 'notifications' | 'security' | 'sessions' | 'language'

interface SettingsNavItem {
  id: SettingsTab
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  category: 'account' | 'system'
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const t = useTranslations('settings')

  const navItems: SettingsNavItem[] = [
    { id: 'general', label: 'Genel', icon: Settings, category: 'account' },
    { id: 'business', label: 'İşletme Profili', icon: Building2, category: 'account' },
    { id: 'billing', label: 'Faturalandırma', icon: CreditCard, category: 'account' },
    { id: 'notifications', label: 'Bildirimler', icon: Bell, category: 'system' },
    { id: 'security', label: 'Güvenlik', icon: Shield, category: 'system' },
    { id: 'sessions', label: 'Oturumlar', icon: Monitor, category: 'system' },
    { id: 'language', label: 'Dil', icon: Globe, category: 'system' },
  ]

  const accountItems = navItems.filter(item => item.category === 'account')
  const systemItems = navItems.filter(item => item.category === 'system')

  return (
    <div className="flex flex-1 overflow-hidden h-full bg-slate-100 dark:bg-slate-900">
      {/* Settings Sidebar */}
      <nav className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hidden md:flex flex-col overflow-y-auto shrink-0">
        <div className="p-4 space-y-1">
          {/* Account Section */}
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Hesap
          </div>
          {accountItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 shadow-sm text-primary font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}

          {/* System Section */}
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Sistem
          </div>
          {systemItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 shadow-sm text-primary font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile Tab Selector */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 px-2 py-2 overflow-x-auto">
        <div className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[60px] transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'general' && <GeneralSettingsContent />}
          {activeTab === 'business' && <BusinessSettingsContent />}
          {activeTab === 'billing' && <BillingSettingsContent />}
          {activeTab === 'notifications' && <NotificationsSettingsContent />}
          {activeTab === 'security' && <SecuritySettingsContent />}
          {activeTab === 'sessions' && <SessionsSettingsContent />}
          {activeTab === 'language' && <LanguageSettingsContent />}
        </div>
      </div>
    </div>
  )
}

// Card Component
function SettingsCard({ 
  title, 
  icon: Icon, 
  iconBg = 'bg-orange-100 dark:bg-orange-900/30',
  iconColor = 'text-primary',
  badge,
  badgeColor = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  headerAction,
  children 
}: { 
  title: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconBg?: string
  iconColor?: string
  badge?: string
  badgeColor?: string
  headerAction?: React.ReactNode
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded ${iconBg}`}>
            <Icon size={18} className={iconColor} />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
              {badge}
            </span>
          )}
          {headerAction}
        </div>
      </div>
      <div className="p-5 flex-1">
        {children}
      </div>
    </div>
  )
}

// Toggle Component
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
    </label>
  )
}

// General Settings Content
function GeneralSettingsContent() {
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [marketing, setMarketing] = useState(false)
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

  // Sessions
  const [sessions, setSessions] = useState<any[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    // Check 2FA status
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

    // Fetch sessions
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/user/sessions')
        if (response.ok) {
          const data = await response.json()
          setSessions(data.sessions?.slice(0, 2) || [])
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
      } finally {
        setLoadingSessions(false)
      }
    }
    fetchSessions()
  }, [])

  // 2FA Functions
  const start2FASetup = async () => {
    setLoading2FA(true)
    setVerifyError('')
    setSetupStep('qr')
    
    try {
      const response = await fetch('/api/user/2fa/setup', { method: 'POST' })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Failed to setup 2FA')
      
      setQrCode(data.qrCode)
      setSecret(data.secret)
      setShow2FAModal(true)
    } catch (error: any) {
      alert(error.message || '2FA kurulumu başarısız')
    } finally {
      setLoading2FA(false)
    }
  }

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
      if (!response.ok) throw new Error(data.error || 'Verification failed')
      
      setSetupStep('success')
      setTwoFactorEnabled(true)
      
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
      if (!response.ok) throw new Error(data.error || 'Failed to disable 2FA')
      
      setTwoFactorEnabled(false)
      setShow2FADisableModal(false)
      setVerificationCode('')
    } catch (error: any) {
      setVerifyError(error.message || 'İşlem başarısız')
    } finally {
      setLoading2FA(false)
    }
  }

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret)
      alert('Gizli anahtar kopyalandı!')
    }
  }

  const formatLastActive = (lastActiveAt: string) => {
    const now = new Date()
    const lastActive = new Date(lastActiveAt)
    const diffMs = now.getTime() - lastActive.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 5) return 'Şu anda aktif'
    if (diffMins < 60) return `${diffMins} dakika önce`
    if (diffHours < 24) return `${diffHours} saat önce`
    return `${diffDays} gün önce`
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Genel Ayarlar</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Hesap tercihlerinizi ve bildirim ayarlarınızı yapılandırın.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">İptal</Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-sm shadow-orange-500/20">
            Değişiklikleri Kaydet
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Notifications Card */}
        <SettingsCard
          title="Bildirimler"
          icon={Bell}
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-primary"
          badge="2 Aktif"
          badgeColor="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Uygulama Bildirimleri</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Yeni mesajlar için anlık bildirim.</p>
              </div>
              <Toggle checked={notifications} onChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">E-posta Güncellemeleri</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Haftalık özet ve güncellemeler.</p>
              </div>
              <Toggle checked={emailUpdates} onChange={setEmailUpdates} />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Pazarlama</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ürün haberleri ve teklifler.</p>
              </div>
              <Toggle checked={marketing} onChange={setMarketing} />
            </div>
          </div>
        </SettingsCard>

        {/* Language & Region Card */}
        <SettingsCard
          title="Dil ve Bölge"
          icon={Globe}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Arayüz Dili
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="tr">🇹🇷 Türkçe</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="de">🇩🇪 Deutsch</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Saat Dilimi
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                >
                  <optgroup label="Avrupa">
                    <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                    <option value="Europe/London">Londra (GMT+0)</option>
                    <option value="Europe/Paris">Paris (GMT+1)</option>
                    <option value="Europe/Berlin">Berlin (GMT+1)</option>
                    <option value="Europe/Amsterdam">Amsterdam (GMT+1)</option>
                    <option value="Europe/Madrid">Madrid (GMT+1)</option>
                    <option value="Europe/Rome">Roma (GMT+1)</option>
                    <option value="Europe/Athens">Atina (GMT+2)</option>
                    <option value="Europe/Moscow">Moskova (GMT+3)</option>
                  </optgroup>
                  <optgroup label="Amerika">
                    <option value="America/New_York">New York (GMT-5)</option>
                    <option value="America/Chicago">Chicago (GMT-6)</option>
                    <option value="America/Denver">Denver (GMT-7)</option>
                    <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
                    <option value="America/Toronto">Toronto (GMT-5)</option>
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/Mexico_City">Mexico City (GMT-6)</option>
                  </optgroup>
                  <optgroup label="Asya / Pasifik">
                    <option value="Asia/Dubai">Dubai (GMT+4)</option>
                    <option value="Asia/Karachi">Karaçi (GMT+5)</option>
                    <option value="Asia/Kolkata">Mumbai (GMT+5:30)</option>
                    <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                    <option value="Asia/Singapore">Singapur (GMT+8)</option>
                    <option value="Asia/Hong_Kong">Hong Kong (GMT+8)</option>
                    <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                    <option value="Asia/Seoul">Seul (GMT+9)</option>
                    <option value="Australia/Sydney">Sidney (GMT+11)</option>
                    <option value="Pacific/Auckland">Auckland (GMT+13)</option>
                  </optgroup>
                  <optgroup label="Afrika / Orta Doğu">
                    <option value="Africa/Cairo">Kahire (GMT+2)</option>
                    <option value="Africa/Johannesburg">Johannesburg (GMT+2)</option>
                    <option value="Asia/Jerusalem">Kudüs (GMT+2)</option>
                    <option value="Asia/Riyadh">Riyad (GMT+3)</option>
                  </optgroup>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
              <Info size={14} className="text-blue-500 shrink-0" />
              <p className="text-xs text-blue-600 dark:text-blue-400">Tarih formatı otomatik olarak GG/AA/YYYY şeklinde ayarlanacaktır.</p>
            </div>
          </div>
        </SettingsCard>

        {/* Security Card */}
        <SettingsCard
          title="Güvenlik"
          icon={Shield}
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          badge={twoFactorEnabled ? 'Güvenli' : undefined}
          badgeColor="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600/50">
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-slate-600 p-1.5 rounded shadow-sm">
                  <Smartphone size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">2FA Doğrulama</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {twoFactorEnabled ? 'Etkinleştirildi' : 'Henüz etkinleştirilmedi.'}
                  </p>
                </div>
              </div>
              {twoFactorEnabled ? (
                <button
                  onClick={() => {
                    setVerifyError('')
                    setVerificationCode('')
                    setShow2FADisableModal(true)
                  }}
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 px-3 py-1.5 bg-red-50 dark:bg-red-900/10 rounded transition-colors"
                >
                  Kapat
                </button>
              ) : (
                <button
                  onClick={start2FASetup}
                  disabled={loading2FA}
                  className="text-xs font-semibold text-primary hover:text-orange-700 dark:hover:text-orange-400 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/10 rounded transition-colors"
                >
                  {loading2FA ? <Loader2 size={14} className="animate-spin" /> : 'Kur'}
                </button>
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600/50">
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-slate-600 p-1.5 rounded shadow-sm">
                  <Key size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Şifre</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">30 gün önce değiştirildi.</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded transition-colors shadow-sm">
                Güncelle
              </button>
            </div>
          </div>
        </SettingsCard>

        {/* Sessions Card */}
        <SettingsCard
          title="Oturumlar"
          icon={Monitor}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
          headerAction={
            <button className="text-xs text-red-600 dark:text-red-400 hover:underline">
              Tümünü Kapat
            </button>
          }
        >
          {loadingSessions ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={20} className="animate-spin text-slate-400" />
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <React.Fragment key={session.id}>
                  {index > 0 && <div className="w-full border-t border-slate-100 dark:border-slate-700" />}
                  <div className={`flex items-start gap-3 ${!session.isCurrent ? 'opacity-60 hover:opacity-100' : ''} transition-opacity`}>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 mt-0.5">
                      {session.deviceType === 'mobile' ? (
                        <Smartphone size={16} />
                      ) : (
                        <Monitor size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">
                          {session.deviceName}
                        </p>
                        {session.isCurrent ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 uppercase">
                            Mevcut
                          </span>
                        ) : (
                          <button className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                            Kapat
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {session.ipAddress || 'Bilinmeyen IP'} • {formatLastActive(session.lastActiveAt)}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              Aktif oturum bulunamadı
            </p>
          )}
        </SettingsCard>
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShow2FAModal(false)}>
          <div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {setupStep === 'success' ? '2FA Etkinleştirildi!' : '2FA Kurulumu'}
              </h2>
              <button onClick={() => setShow2FAModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {setupStep === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  İki Faktörlü Kimlik Doğrulama Etkinleştirildi
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Hesabınız artık 2FA ile korunuyor.
                </p>
              </div>
            ) : setupStep === 'qr' ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Authenticator uygulamanızla QR kodunu tarayın:
                  </p>
                  {qrCode && (
                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                      <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 mx-auto" />
                    </div>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    QR kodu tarayamıyor musunuz? Manuel kod:
                  </p>
                  {secret && (
                    <div className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-3">
                      <code className="text-sm font-mono text-slate-800 dark:text-white break-all">{secret}</code>
                      <button onClick={copySecret} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded" title="Kopyala">
                        <Copy size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <Button className="w-full" onClick={() => setSetupStep('verify')}>Devam Et</Button>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Authenticator uygulamanızdaki 6 haneli kodu girin:
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value.replace(/\D/g, ''))
                      setVerifyError('')
                    }}
                    placeholder="000000"
                    className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    autoFocus
                  />
                  {verifyError && <p className="text-sm text-red-500 mt-2">{verifyError}</p>}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setSetupStep('qr')}>Geri</Button>
                  <Button className="flex-1" onClick={verify2FA} disabled={loading2FA || verificationCode.length !== 6}>
                    {loading2FA ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    Doğrula
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2FA Disable Modal */}
      {show2FADisableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShow2FADisableModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">2FA Devre Dışı Bırak</h2>
              <button onClick={() => setShow2FADisableModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ 2FA'yı devre dışı bırakmak hesabınızın güvenliğini azaltır.
                </p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Devam etmek için 6 haneli kodu girin:
              </p>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, ''))
                  setVerifyError('')
                }}
                placeholder="000000"
                className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                autoFocus
              />
              {verifyError && <p className="text-sm text-red-500 mt-2">{verifyError}</p>}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShow2FADisableModal(false)}>İptal</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={disable2FA} disabled={loading2FA || verificationCode.length !== 6}>
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

// Business Settings Content
function BusinessSettingsContent() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">İşletme Profili</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          İşletme bilgilerinizi ve iletişim detaylarınızı yönetin.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
          İşletme profili ayarları yakında eklenecek.
        </p>
      </div>
    </>
  )
}

// Billing Settings Content
function BillingSettingsContent() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Faturalandırma</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Abonelik planınızı ve ödeme bilgilerinizi yönetin.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
          Faturalandırma ayarları yakında eklenecek.
        </p>
      </div>
    </>
  )
}

// Notifications Settings Content
function NotificationsSettingsContent() {
  const [appAlerts, setAppAlerts] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [weeklyReport, setWeeklyReport] = useState(true)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Bildirim Ayarları</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Nasıl ve ne zaman bildirim almak istediğinizi yapılandırın.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Uygulama Bildirimleri</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Yeni mesajlar için anlık bildirim alın.</p>
          </div>
          <Toggle checked={appAlerts} onChange={setAppAlerts} />
        </div>
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">E-posta Güncellemeleri</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Önemli güncellemeleri e-posta ile alın.</p>
          </div>
          <Toggle checked={emailUpdates} onChange={setEmailUpdates} />
        </div>
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">SMS Bildirimleri</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Kritik uyarılar için SMS alın.</p>
          </div>
          <Toggle checked={smsAlerts} onChange={setSmsAlerts} />
        </div>
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Haftalık Rapor</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Her hafta performans özeti alın.</p>
          </div>
          <Toggle checked={weeklyReport} onChange={setWeeklyReport} />
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Pazarlama E-postaları</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ürün haberleri ve özel teklifler.</p>
          </div>
          <Toggle checked={marketing} onChange={setMarketing} />
        </div>
      </div>
    </>
  )
}

// Security Settings Content
function SecuritySettingsContent() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Güvenlik Ayarları</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Hesap güvenliğinizi yönetin ve koruyun.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
          Detaylı güvenlik ayarları için Genel sekmesini kullanın.
        </p>
      </div>
    </>
  )
}

// Sessions Settings Content  
function SessionsSettingsContent() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const revokeSession = async (sessionId: string) => {
    try {
      setRevokingId(sessionId)
      const response = await fetch(`/api/user/sessions/${sessionId}`, { method: 'DELETE' })
      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId))
      }
    } catch (error) {
      console.error('Failed to revoke session:', error)
    } finally {
      setRevokingId(null)
    }
  }

  const revokeAllSessions = async () => {
    if (!confirm('Mevcut oturumunuz hariç tüm oturumları kapatmak istediğinize emin misiniz?')) return
    
    try {
      setRevokingAll(true)
      const response = await fetch('/api/user/sessions', { method: 'DELETE' })
      if (response.ok) {
        setSessions(prev => prev.filter(s => s.isCurrent))
      }
    } catch (error) {
      console.error('Failed to revoke sessions:', error)
    } finally {
      setRevokingAll(false)
    }
  }

  const formatLastActive = (lastActiveAt: string) => {
    const now = new Date()
    const lastActive = new Date(lastActiveAt)
    const diffMs = now.getTime() - lastActive.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 5) return 'Şu anda aktif'
    if (diffMins < 60) return `${diffMins} dakika önce`
    if (diffHours < 24) return `${diffHours} saat önce`
    return `${diffDays} gün önce`
  }

  const otherSessions = sessions.filter(s => !s.isCurrent)

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Aktif Oturumlar</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Hesabınıza giriş yapılan cihazları görüntüleyin ve yönetin.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={fetchSessions} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
            Yenile
          </Button>
          {otherSessions.length > 0 && (
            <Button 
              size="sm" 
              onClick={revokeAllSessions}
              disabled={revokingAll}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {revokingAll ? <Loader2 size={16} className="animate-spin mr-2" /> : <LogOut size={16} className="mr-2" />}
              Tümünü Kapat
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Monitor size={48} className="mx-auto mb-3 opacity-50" />
            <p>Aktif oturum bulunamadı</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                className={`flex items-center gap-4 p-4 ${session.isCurrent ? 'bg-green-50/50 dark:bg-green-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'} transition-colors`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.isCurrent ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                  {session.deviceType === 'mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {session.deviceName}
                    </p>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 uppercase shrink-0">
                        Bu Cihaz
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {session.ipAddress || 'Bilinmeyen IP'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatLastActive(session.lastActiveAt)}
                    </span>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revokeSession(session.id)}
                    disabled={revokingId === session.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {revokingId === session.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// Language Settings Content
function LanguageSettingsContent() {
  const [language, setLanguage] = useState('tr')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dil Ayarları</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Arayüz dilini ve bölgesel tercihlerinizi ayarlayın.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Arayüz Dili
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full max-w-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="tr">🇹🇷 Türkçe</option>
            <option value="en">🇺🇸 English</option>
            <option value="de">🇩🇪 Deutsch</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Tarih Formatı
          </label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full max-w-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="DD/MM/YYYY">GG/AA/YYYY (31/01/2026)</option>
            <option value="MM/DD/YYYY">AA/GG/YYYY (01/31/2026)</option>
            <option value="YYYY-MM-DD">YYYY-AA-GG (2026-01-31)</option>
          </select>
        </div>
      </div>
    </>
  )
}
