import { createAndSendOtp, verifyOtp } from "../utils/services/otp-service.js";
import { userModel } from "../models/user-model.js";
import { encryptPassword } from "../utils/services/password-hash.js";
import { isAllowedDomain, isDisposable } from "../utils/services/email-check.js";
import { canSendOtp, recordOtpAttempt, resetOtpRateLimit } from "../utils/services/otp-rate-limiter.js";

// 1️⃣ Send OTP (User not created yet) - NOW WITH RATE LIMITING
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ CHECK RATE LIMIT FIRST
    const rateLimitCheck = canSendOtp(email);
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({ 
        message: rateLimitCheck.message,
        retryAfter: rateLimitCheck.retryAfter 
      });
    }

    // ✅ Check if email is disposable/temporary
    if (isDisposable(email)) {
      return res.status(400).json({
        message: "Temporary / Disposable email addresses are not allowed."
      });
    }

    // ✅ Check if email provider is allowed
    if (!isAllowedDomain(email)) {
      return res.status(400).json({
        message: "Email provider not supported. Use valid mail providers like Gmail, Yahoo, Outlook, Hotmail, or ProtonMail."
      });
    }

    // ✅ If user already exists -> stop registration
    const existing = await userModel.findOne({ email }).exec();
    if (existing) {
      return res.status(409).json({ message: "Email already registered. Please login instead." });
    }

    // ✅ Send OTP
    await createAndSendOtp(email);
    
    // ✅ RECORD THE ATTEMPT
    recordOtpAttempt(email);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


// 2️⃣ Verify OTP & Register User (Dynamic fields allowed)
export const verifyOtpAndRegister = async (req, res) => {
  try {
    const userObject = req.body;
    const { email, otp } = userObject;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

    // Verify OTP
    const result = await verifyOtp(email, otp);
    if (!result.ok) {
      return res.status(400).json({ success: false, message: result.message });
    }

    // Delete OTP field before saving
    delete userObject.otp;

    // Encrypt password dynamically
    if (userObject.password) {
      userObject.password = encryptPassword(userObject.password);
    }

    // Create new user with ALL dynamic fields
    const newUser = await userModel.create(userObject);

    // ✅ RESET RATE LIMIT ON SUCCESSFUL VERIFICATION
    resetOtpRateLimit(email);

    return res.status(200).json({
      success: true,
      message: "Registration successful.",
      user: {
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err) {
    console.log("User Creation Error:", err);
    return res
      .status(500)
      .json({ message: "Error creating user. Try again." });
  }
};