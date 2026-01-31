// Device and User Agent Parser for Session Management

export interface DeviceInfo {
  deviceName: string
  browser: string
  os: string
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  isCurrent?: boolean
}

/**
 * Parse user agent string to extract device information
 */
export function parseUserAgent(userAgent: string | null | undefined): DeviceInfo {
  if (!userAgent) {
    return {
      deviceName: 'Bilinmeyen Cihaz',
      browser: 'Unknown',
      os: 'Unknown',
      deviceType: 'unknown',
    }
  }

  const ua = userAgent.toLowerCase()

  // Detect browser
  let browser = 'Unknown Browser'
  if (ua.includes('edg/') || ua.includes('edge/')) {
    browser = 'Microsoft Edge'
  } else if (ua.includes('chrome/') && !ua.includes('edg/')) {
    browser = 'Google Chrome'
  } else if (ua.includes('firefox/')) {
    browser = 'Mozilla Firefox'
  } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
    browser = 'Safari'
  } else if (ua.includes('opera/') || ua.includes('opr/')) {
    browser = 'Opera'
  } else if (ua.includes('msie') || ua.includes('trident/')) {
    browser = 'Internet Explorer'
  }

  // Detect OS
  let os = 'Unknown OS'
  if (ua.includes('windows nt 10')) {
    os = 'Windows 10/11'
  } else if (ua.includes('windows nt')) {
    os = 'Windows'
  } else if (ua.includes('mac os x')) {
    os = 'macOS'
  } else if (ua.includes('android')) {
    os = 'Android'
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS'
  } else if (ua.includes('linux')) {
    os = 'Linux'
  }

  // Detect device type
  let deviceType: DeviceInfo['deviceType'] = 'desktop'
  if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
    if (ua.includes('tablet') || ua.includes('ipad')) {
      deviceType = 'tablet'
    } else {
      deviceType = 'mobile'
    }
  }

  // Generate device name
  const deviceName = `${browser} - ${os}`

  return {
    deviceName,
    browser,
    os,
    deviceType,
  }
}

/**
 * Get device icon based on device type
 */
export function getDeviceIcon(deviceType: DeviceInfo['deviceType']): string {
  switch (deviceType) {
    case 'mobile':
      return 'smartphone'
    case 'tablet':
      return 'tablet'
    case 'desktop':
      return 'monitor'
    default:
      return 'monitor'
  }
}

/**
 * Format last active time as relative time string
 */
export function formatLastActive(lastActiveAt: Date | string): string {
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
 * Check if session is inactive (no activity for specified hours)
 */
export function isSessionInactive(lastActiveAt: Date | string, inactiveHours: number = 168): boolean {
  const now = new Date()
  const lastActive = new Date(lastActiveAt)
  const diffMs = now.getTime() - lastActive.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours > inactiveHours
}
