'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

interface UserSession {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('settings')
  const [user, setUser] = useState<UserSession['user'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/get-session')
        const session: UserSession = await response.json()
        if (session?.user) {
          setUser(session.user)
          setFormData({
            name: session.user.name || '',
            email: session.user.email || '',
            role: '', // Role will be fetched from user profile if needed
          })
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          role: formData.role.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      const result = await response.json()
      
      // Update local state
      if (result.user) {
        setUser(result.user)
        // Show success message
        alert('Profil başarıyla güncellendi!')
        // Optionally refresh the page to show updated data
        router.refresh()
      }
    } catch (error: any) {
      console.error('Failed to save profile:', error)
      alert(error.message || 'Profil güncellenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  const userName = user?.name || user?.email || 'User'
  const userEmail = user?.email || ''

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="p-2"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profil</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="hidden sm:flex"
          >
            <X size={16} className="mr-2" />
            İptal
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex gap-6 items-center">
              <Avatar name={userName} size="lg" src={user?.image || undefined} />
              <div className="flex flex-col justify-center gap-1">
                <p className="text-gray-900 dark:text-white text-2xl font-bold">{userName}</p>
                <p className="text-gray-500 dark:text-gray-400 text-base">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Personal Info Form Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('personalInfo')}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('personalInfoDesc')}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                    Ad Soyad
                  </label>
                  <input
                    className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                    E-posta
                  </label>
                  <input
                    className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="E-posta adresiniz"
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">E-posta adresi değiştirilemez</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="role">
                    {t('role')}
                  </label>
                  <input
                    className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                    id="role"
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Pozisyonunuz"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('password')}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('passwordDesc')}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="currentPassword">
                    {t('currentPassword')}
                  </label>
                  <input
                    className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                    id="currentPassword"
                    type="password"
                    placeholder="Mevcut şifreniz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="newPassword">
                    {t('newPassword')}
                  </label>
                  <input
                    className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                    id="newPassword"
                    type="password"
                    placeholder="Yeni şifreniz"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
