// Feature flags for gradual rollout
// Set to true to enable a feature for all users
// Set to false to keep it disabled

export const FEATURES = {
  // Enhanced analysis with scoring system
  ENHANCED_ANALYSIS: false,
  
  // AI chat feature
  AI_CHAT: false,
  
  // Auto-generate optimal routine
  ROUTINE_GENERATOR: false,
  
  // Product alternatives recommendations
  ALTERNATIVES: false,
  
  // Product reviews integration
  REVIEWS: false,
}

// Beta tester email list (enable new features for these users)
export const BETA_TESTERS = [
  'your-email@example.com', // Replace with your actual email
  // Add more beta tester emails here
]

// Check if user has access to a feature
export function hasFeatureAccess(featureName, userEmail = null) {
  // If feature is globally enabled, everyone has access
  if (FEATURES[featureName] === true) {
    return true
  }
  
  // If user is a beta tester, they get access
  if (userEmail && BETA_TESTERS.includes(userEmail)) {
    return true
  }
  
  return false
}
