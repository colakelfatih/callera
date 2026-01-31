'use client'

import { useActionState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Phone, Mail, Globe, MapPin, Briefcase, Loader2 } from 'lucide-react'
import { saveBusinessProfile, type ActionState } from '@/actions/onboarding.actions'
import { Button } from '@/components/ui/button'

interface StepBusinessProfileProps {
  initialData: {
    businessName: string
    businessPhone: string
    businessEmail: string
    businessWebsite: string
    businessIndustry: string
  } | null
}

const INDUSTRIES = [
  { value: '', label: 'Sektör Seçin' },
  { value: 'ecommerce', label: 'E-Ticaret' },
  { value: 'retail', label: 'Perakende' },
  { value: 'saas', label: 'SaaS / Yazılım' },
  { value: 'healthcare', label: 'Sağlık' },
  { value: 'education', label: 'Eğitim' },
  { value: 'finance', label: 'Finans / Bankacılık' },
  { value: 'realestate', label: 'Gayrimenkul' },
  { value: 'hospitality', label: 'Otelcilik / Turizm' },
  { value: 'restaurant', label: 'Restoran / Yiyecek' },
  { value: 'consulting', label: 'Danışmanlık' },
  { value: 'marketing', label: 'Pazarlama / Reklam' },
  { value: 'other', label: 'Diğer' },
]

export function StepBusinessProfile({ initialData }: StepBusinessProfileProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    saveBusinessProfile,
    null
  )

  // Handle successful submission
  useEffect(() => {
    if (state?.success && state?.nextStep) {
      router.refresh()
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-6">
      {/* Error Message */}
      {state?.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        </div>
      )}

      {/* Business Name - Required */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          İşletme Adı <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            name="businessName"
            required
            defaultValue={initialData?.businessName}
            placeholder="Şirketinizin adı"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Telefon
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="tel"
              name="businessPhone"
              defaultValue={initialData?.businessPhone}
              placeholder="+90 212 123 4567"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            E-posta
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              name="businessEmail"
              defaultValue={initialData?.businessEmail}
              placeholder="info@sirket.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Web Sitesi
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="url"
              name="businessWebsite"
              defaultValue={initialData?.businessWebsite}
              placeholder="https://sirket.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Sektör
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              name="businessIndustry"
              defaultValue={initialData?.businessIndustry}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
            >
              {INDUSTRIES.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Adres
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
          <textarea
            name="businessAddress"
            rows={2}
            placeholder="İşletme adresi (opsiyonel)"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-sm shadow-orange-500/20 transition-all"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Kaydediliyor...
            </>
          ) : (
            'Devam Et'
          )}
        </Button>
      </div>
    </form>
  )
}
