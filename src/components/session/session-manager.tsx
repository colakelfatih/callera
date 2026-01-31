'use client'

import React, { useState, useEffect } from 'react'
import { Monitor, Smartphone, Tablet, MapPin, Clock, Trash2, LogOut, Loader2, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SessionData {
  id: string
  deviceName: string
  browser: string
  os: string
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  ipAddress: string | null
  location: string | null
  lastActiveAt: string
  createdAt: string
  isCurrent: boolean
}

/**
 * Format relative time for last active
 */
function formatLastActive(lastActiveAt: string): string {
  const now = new Date()
  const lastActive = new Date(lastActiveAt)
  const diffMs = now.getTime() - lastActive.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return 'Şu anda aktif'
  } else if (diffMins < 60) {
    return `${diffMins} dakika önce`
  } else if (diffHours < 24) {
    return `${diffHours} saat önce`
  } else if (diffDays === 1) {
    return 'Dün'
  } else if (diffDays < 7) {
    return `${diffDays} gün önce`
  } else {
    return lastActive.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
}

/**
 * Get device icon component based on device type
 */
function DeviceIcon({ deviceType, className }: { deviceType: SessionData['deviceType']; className?: string }) {
  switch (deviceType) {
    case 'mobile':
      return <Smartphone className={className} />
    case 'tablet':
      return <Tablet className={className} />
    default:
      return <Monitor className={className} />
  }
}

export function SessionManager() {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/user/sessions')
      
      if (!response.ok) {
        throw new Error('Oturumlar yüklenemedi')
      }
      
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  // Revoke a specific session
  const revokeSession = async (sessionId: string) => {
    try {
      setRevokingId(sessionId)
      const response = await fetch(`/api/user/sessions/${sessionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Oturum kapatılamadı')
      }

      // Remove from list
      setSessions(prev => prev.filter(s => s.id !== sessionId))
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu')
    } finally {
      setRevokingId(null)
    }
  }

  // Revoke all other sessions
  const revokeAllSessions = async () => {
    if (!confirm('Mevcut oturumunuz hariç tüm oturumları kapatmak istediğinize emin misiniz?')) {
      return
    }

    try {
      setRevokingAll(true)
      const response = await fetch('/api/user/sessions', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Oturumlar kapatılamadı')
      }

      const data = await response.json()
      
      // Keep only current session
      setSessions(prev => prev.filter(s => s.isCurrent))
      
      alert(data.message || 'Tüm oturumlar kapatıldı')
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu')
    } finally {
      setRevokingAll(false)
    }
  }

  const otherSessions = sessions.filter(s => !s.isCurrent)
  const currentSession = sessions.find(s => s.isCurrent)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Monitor size={20} className="text-primary" />
              Aktif Oturumlar
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Hesabınıza giriş yapılan cihazları görüntüleyin ve yönetin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSessions}
              disabled={loading}
              className="p-2"
              title="Yenile"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </Button>
            {otherSessions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={revokeAllSessions}
                disabled={revokingAll || loading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 px-4 min-w-[160px] flex items-center gap-2"
              >
                {revokingAll ? (
                  <Loader2 size={16} className="animate-spin flex-shrink-0" />
                ) : (
                  <LogOut size={16} className="flex-shrink-0" />
                )}
                <span>Tümünü Kapat</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle size={32} className="text-yellow-500 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSessions}
              className="mt-4"
            >
              Tekrar Dene
            </Button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Monitor size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aktif oturum bulunamadı</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Session */}
            {currentSession && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <DeviceIcon
                      deviceType={currentSession.deviceType}
                      className="w-6 h-6 text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-navy dark:text-white">
                        {currentSession.deviceName}
                      </h4>
                      <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <CheckCircle size={12} />
                        Bu Cihaz
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatLastActive(currentSession.lastActiveAt)}
                      </span>
                      {currentSession.ipAddress && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {currentSession.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Sessions */}
            {otherSessions.length > 0 && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Diğer Oturumlar ({otherSessions.length})
                  </h4>
                </div>

                {otherSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                      <DeviceIcon
                        deviceType={session.deviceType}
                        className="w-6 h-6 text-gray-600 dark:text-gray-400"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-navy dark:text-white mb-1">
                        {session.deviceName}
                      </h4>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatLastActive(session.lastActiveAt)}
                        </span>
                        {session.ipAddress && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {session.ipAddress}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                      disabled={revokingId === session.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {revokingId === session.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </div>
                ))}
              </>
            )}

            {/* Info text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              💡 Şüpheli bir oturum görürseniz, hemen kapatın ve şifrenizi değiştirin.
              Uzun süre aktif olmayan oturumlar otomatik olarak sonlandırılacaktır.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
