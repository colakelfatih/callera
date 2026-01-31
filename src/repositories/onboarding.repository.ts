// Onboarding Repository
// Handles all database operations related to onboarding

import { db } from '@/lib/db'

export interface BusinessProfileData {
  businessName: string
  businessPhone?: string
  businessEmail?: string
  businessAddress?: string
  businessWebsite?: string
  businessIndustry?: string
}

export interface OnboardingStatus {
  onboardingCompleted: boolean
  onboardingStep: number
  businessName: string | null
  businessPhone: string | null
  businessEmail: string | null
  businessWebsite: string | null
  businessIndustry: string | null
}

export const OnboardingRepository = {
  /**
   * Get current onboarding status for a user
   */
  async getStatus(userId: string): Promise<OnboardingStatus | null> {
    return db.user.findUnique({
      where: { id: userId },
      select: {
        onboardingCompleted: true,
        onboardingStep: true,
        businessName: true,
        businessPhone: true,
        businessEmail: true,
        businessWebsite: true,
        businessIndustry: true,
      },
    })
  },

  /**
   * Update the current onboarding step
   */
  async updateStep(userId: string, step: number) {
    return db.user.update({
      where: { id: userId },
      data: { onboardingStep: step },
    })
  },

  /**
   * Save business profile data and advance to step 2
   */
  async saveBusinessProfile(userId: string, data: BusinessProfileData) {
    return db.user.update({
      where: { id: userId },
      data: {
        businessName: data.businessName,
        businessPhone: data.businessPhone || null,
        businessEmail: data.businessEmail || null,
        businessAddress: data.businessAddress || null,
        businessWebsite: data.businessWebsite || null,
        businessIndustry: data.businessIndustry || null,
        onboardingStep: 2,
      },
    })
  },

  /**
   * Mark onboarding as complete
   */
  async complete(userId: string) {
    return db.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        onboardingStep: 4,
      },
    })
  },

  /**
   * Check if user has completed onboarding
   */
  async isCompleted(userId: string): Promise<boolean> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { onboardingCompleted: true },
    })
    return user?.onboardingCompleted ?? false
  },

  /**
   * Reset onboarding (for testing/admin purposes)
   */
  async reset(userId: string) {
    return db.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: false,
        onboardingStep: 0,
        businessName: null,
        businessPhone: null,
        businessEmail: null,
        businessAddress: null,
        businessWebsite: null,
        businessIndustry: null,
      },
    })
  },
}
