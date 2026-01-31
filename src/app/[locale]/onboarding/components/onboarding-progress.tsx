'use client'

import { Check } from 'lucide-react'

interface OnboardingProgressProps {
  currentStep: number
  steps: Array<{
    id: number
    title: string
    description: string
  }>
}

export function OnboardingProgress({ currentStep, steps }: OnboardingProgressProps) {
  return (
    <div className="mb-6">
      {/* Progress Steps - Centered */}
      <div className="flex items-start justify-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-start">
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center w-24 md:w-32">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : isCurrent
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    isCurrent
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`w-12 md:w-20 h-1 mt-5 rounded-full transition-all -mx-2 ${
                    isCompleted
                      ? 'bg-primary'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Current Step Info */}
      <div className="text-center mt-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
          {steps.find(s => s.id === currentStep)?.title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {steps.find(s => s.id === currentStep)?.description}
        </p>
      </div>
    </div>
  )
}
