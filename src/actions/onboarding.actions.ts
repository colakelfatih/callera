'use server'

// Onboarding Server Actions
// Form submission handlers for onboarding flow

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import { OnboardingRepository, type BusinessProfileData } from '@/repositories/onboarding.repository'
import { IntegrationRepository } from '@/repositories/integration.repository'

// Form state types
export interface ActionState {
  success: boolean
  error?: string
  nextStep?: number
}

/**
 * Save business profile and advance to step 2
 */
export async function saveBusinessProfile(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Oturum açmanız gerekiyor' }
    }

    const businessName = formData.get('businessName') as string
    if (!businessName || businessName.trim().length === 0) {
      return { success: false, error: 'İşletme adı zorunludur' }
    }

    const data: BusinessProfileData = {
      businessName: businessName.trim(),
      businessPhone: (formData.get('businessPhone') as string)?.trim() || undefined,
      businessEmail: (formData.get('businessEmail') as string)?.trim() || undefined,
      businessAddress: (formData.get('businessAddress') as string)?.trim() || undefined,
      businessWebsite: (formData.get('businessWebsite') as string)?.trim() || undefined,
      businessIndustry: (formData.get('businessIndustry') as string)?.trim() || undefined,
    }

    await OnboardingRepository.saveBusinessProfile(user.id, data)
    revalidatePath('/onboarding')

    return { success: true, nextStep: 2 }
  } catch (error) {
    console.error('Error saving business profile:', error)
    return { success: false, error: 'Profil kaydedilirken bir hata oluştu' }
  }
}

/**
 * Skip integration step and go to step 3
 */
export async function skipIntegrationStep(): Promise<ActionState> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Oturum açmanız gerekiyor' }
    }

    await OnboardingRepository.updateStep(user.id, 3)
    revalidatePath('/onboarding')

    return { success: true, nextStep: 3 }
  } catch (error) {
    console.error('Error skipping integration step:', error)
    return { success: false, error: 'İşlem başarısız oldu' }
  }
}

/**
 * Go back to integration step (step 2)
 */
export async function goBackToIntegrationStep(): Promise<ActionState> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Oturum açmanız gerekiyor' }
    }

    await OnboardingRepository.updateStep(user.id, 2)
    revalidatePath('/onboarding')

    return { success: true, nextStep: 2 }
  } catch (error) {
    console.error('Error going back to integration step:', error)
    return { success: false, error: 'İşlem başarısız oldu' }
  }
}

/**
 * Mark integration step as complete (called after successful connection)
 */
export async function completeIntegrationStep(): Promise<ActionState> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Oturum açmanız gerekiyor' }
    }

    // Verify user has at least one connection
    const hasConnection = await IntegrationRepository.hasAnyConnection(user.id)
    if (!hasConnection) {
      return { success: false, error: 'En az bir entegrasyon bağlamalısınız' }
    }

    await OnboardingRepository.updateStep(user.id, 3)
    revalidatePath('/onboarding')

    return { success: true, nextStep: 3 }
  } catch (error) {
    console.error('Error completing integration step:', error)
    return { success: false, error: 'İşlem başarısız oldu' }
  }
}

/**
 * Send test message
 */
export async function sendTestMessage(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Oturum açmanız gerekiyor' }
    }

    const phoneNumber = formData.get('phoneNumber') as string
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return { success: false, error: 'Telefon numarası zorunludur' }
    }

    // Get first available connection
    const connection = await IntegrationRepository.getFirstConnection(user.id)
    
    if (!connection.type || !connection.connectionId) {
      return { success: false, error: 'Bağlı bir entegrasyon bulunamadı' }
    }

    // Send test message based on connection type
    if (connection.type === 'whatsapp' && connection.phoneNumberId && connection.accessToken) {
      // Import WhatsApp client dynamically to avoid circular dependencies
      const { sendWhatsAppTextMessage } = await import('@/lib/clients/whatsapp-client')
      
      // Format phone number (remove + and spaces)
      const formattedPhone = phoneNumber.replace(/[\s+\-()]/g, '')
      
      const result = await sendWhatsAppTextMessage({
        phoneNumberId: connection.phoneNumberId,
        accessToken: connection.accessToken,
        to: formattedPhone,
        text: '🎉 Tebrikler! Callera kurulumunuz başarıyla tamamlandı. Artık müşterilerinizle iletişime geçebilirsiniz.',
      })

      if (!result.messages?.[0]?.id) {
        return { success: false, error: 'Mesaj gönderilemedi. Telefon numarasını kontrol edin.' }
      }
    } else if (connection.type === 'instagram') {
      // Instagram doesn't support sending to arbitrary phone numbers
      // Just mark as successful for now
      return { success: true, nextStep: 4 }
    }

    return { success: true, nextStep: 4 }
  } catch (error: any) {
    console.error('Error sending test message:', error)
    return { success: false, error: error.message || 'Mesaj gönderilemedi' }
  }
}

/**
 * Skip test message and complete onboarding
 */
export async function skipTestMessage(): Promise<ActionState> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Oturum açmanız gerekiyor' }
    }

    await OnboardingRepository.complete(user.id)
    revalidatePath('/onboarding')

    return { success: true, nextStep: 4 }
  } catch (error) {
    console.error('Error skipping test message:', error)
    return { success: false, error: 'İşlem başarısız oldu' }
  }
}

/**
 * Complete onboarding and redirect to dashboard
 */
export async function completeOnboarding(): Promise<void> {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  await OnboardingRepository.complete(user.id)
  redirect('/dashboard')
}

/**
 * Get current onboarding status (for client components)
 */
export async function getOnboardingStatus() {
  const user = await getCurrentUser()
  if (!user) {
    return null
  }

  const [status, integrationStatus] = await Promise.all([
    OnboardingRepository.getStatus(user.id),
    IntegrationRepository.getStatus(user.id),
  ])

  return {
    ...status,
    integrations: integrationStatus,
  }
}
