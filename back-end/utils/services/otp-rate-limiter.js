// utils/services/otp-rate-limiter.js

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map();

const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 60 * 1000; // 1 minute
const LOCKOUT_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if an email can send OTP
 * @param {string} email 
 * @returns {Object} { allowed: boolean, message?: string, retryAfter?: number }
 */
export function canSendOtp(email) {
  const key = email.toLowerCase();
  const now = Date.now();
  
  // Get existing data
  let data = rateLimitStore.get(key);
  
  if (!data) {
    // First attempt - allow
    return { allowed: true };
  }

  // Check if in hourly lockout
  if (data.lockoutUntil && now < data.lockoutUntil) {
    const minutesLeft = Math.ceil((data.lockoutUntil - now) / 60000);
    return {
      allowed: false,
      message: `Too many OTP requests. Please try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`,
      retryAfter: data.lockoutUntil
    };
  }

  // Lockout expired - reset
  if (data.lockoutUntil && now >= data.lockoutUntil) {
    rateLimitStore.delete(key);
    return { allowed: true };
  }

  // Check 60-second cooldown
  if (data.lastAttempt && now - data.lastAttempt < COOLDOWN_MS) {
    const secondsLeft = Math.ceil((COOLDOWN_MS - (now - data.lastAttempt)) / 1000);
    return {
      allowed: false,
      message: `Please wait ${secondsLeft} second${secondsLeft !== 1 ? 's' : ''} before requesting another OTP.`,
      retryAfter: data.lastAttempt + COOLDOWN_MS
    };
  }

  // Check if reached max attempts
  if (data.attempts >= MAX_ATTEMPTS) {
    // Apply 1-hour lockout
    const lockoutUntil = now + LOCKOUT_MS;
    data.lockoutUntil = lockoutUntil;
    rateLimitStore.set(key, data);
    
    return {
      allowed: false,
      message: `Maximum OTP requests exceeded. Please try again in 1 hour.`,
      retryAfter: lockoutUntil
    };
  }

  // Within limits - allow
  return { allowed: true };
}

/**
 * Record an OTP send attempt
 * @param {string} email 
 */
export function recordOtpAttempt(email) {
  const key = email.toLowerCase();
  const now = Date.now();
  
  let data = rateLimitStore.get(key);
  
  if (!data) {
    // First attempt
    data = {
      attempts: 1,
      lastAttempt: now,
      lockoutUntil: null
    };
  } else {
    // Increment attempts
    data.attempts += 1;
    data.lastAttempt = now;
  }
  
  rateLimitStore.set(key, data);
  
  console.log(`📊 OTP Attempt recorded for ${email}:`, {
    attempts: data.attempts,
    maxAttempts: MAX_ATTEMPTS
  });
}

/**
 * Reset rate limit for an email (call after successful verification)
 * @param {string} email 
 */
export function resetOtpRateLimit(email) {
  const key = email.toLowerCase();
  rateLimitStore.delete(key);
  console.log(`✅ Rate limit reset for ${email}`);
}

/**
 * Get current rate limit status for an email
 * @param {string} email 
 * @returns {Object}
 */
export function getOtpRateLimitStatus(email) {
  const key = email.toLowerCase();
  const data = rateLimitStore.get(key);
  
  if (!data) {
    return {
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      inLockout: false
    };
  }
  
  const now = Date.now();
  const inLockout = data.lockoutUntil && now < data.lockoutUntil;
  
  return {
    attempts: data.attempts,
    maxAttempts: MAX_ATTEMPTS,
    inLockout,
    lockoutUntil: data.lockoutUntil,
    lastAttempt: data.lastAttempt
  };
}

// Cleanup expired entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, data] of rateLimitStore.entries()) {
    // Remove if lockout expired and no recent activity
    if (data.lockoutUntil && now >= data.lockoutUntil) {
      if (!data.lastAttempt || now - data.lastAttempt > LOCKOUT_MS) {
        rateLimitStore.delete(key);
        cleaned++;
      }
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned ${cleaned} expired rate limit entries`);
  }
}, 15 * 60 * 1000);