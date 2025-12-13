import { NextResponse } from 'next/server'

// Feature flag configuration
const FEATURE_FLAGS = {
  ENHANCED_ANALYSIS: false, // Toggle this to enable/disable
  AI_CHAT: false,
  ROUTINE_GENERATOR: false,
  ALTERNATIVES: false,
  REVIEWS: false,
}

// Beta testers who get early access
const BETA_TESTERS = [
  'sserubiri47@gmail.com',
  // Add more beta tester emails here
]

export async function POST(request) {
  try {
    const { userId, email, feature } = await request.json()

    if (!feature || !FEATURE_FLAGS.hasOwnProperty(feature)) {
      return NextResponse.json({ 
        hasAccess: false,
        error: 'Invalid feature' 
      }, { status: 400 })
    }

    // Check if feature is globally enabled
    const isEnabled = FEATURE_FLAGS[feature]

    // Check if user is a beta tester
    const isBetaTester = email && BETA_TESTERS.includes(email.toLowerCase())

    // User has access if either:
    // 1. Feature is globally enabled, OR
    // 2. User is a beta tester
    const hasAccess = isEnabled || isBetaTester

    return NextResponse.json({
      hasAccess,
      feature,
      reason: hasAccess 
        ? (isBetaTester ? 'beta_tester' : 'globally_enabled')
        : 'not_enabled'
    })

  } catch (error) {
    console.error('Feature access check error:', error)
    return NextResponse.json({ 
      hasAccess: false,
      error: error.message 
    }, { status: 500 })
  }
}
