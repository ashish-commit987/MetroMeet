// utils/services/otp-service.js
import { otpModel } from "../../models/otp-model.js";
import { encryptPassword, compareHash } from "./password-hash.js";
import { sendOtpEmail } from "./brevo-email-service.js"; // ✅ NEW IMPORT

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createAndSendOtp = async (email) => {
  try {
    const otp = generateOtp();
    const otpHash = encryptPassword(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await otpModel.deleteMany({ email });

    // Save new OTP
    await otpModel.create({
      email,
      otpHash,
      expiresAt,
    });

    console.log("✅ OTP saved in database for:", email);

    // ✅ Send email using Resend
    await sendOtpEmail(email, otp);
    
    console.log("✅ OTP email sent successfully via Resend");
    return { success: true };

  } catch (err) {
    console.error("❌ createAndSendOtp error:", err);
    throw err;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const otpRecord = await otpModel.findOne({ email }).exec();

    if (!otpRecord) {
      return { ok: false, message: "OTP not found or expired" };
    }

    if (new Date() > otpRecord.expiresAt) {
      await otpModel.deleteOne({ email });
      return { ok: false, message: "OTP expired" };
    }

    const isValid = compareHash(otp, otpRecord.otpHash);

    if (!isValid) {
      return { ok: false, message: "Invalid OTP" };
    }

    await otpModel.deleteOne({ email });
    return { ok: true, message: "OTP verified successfully" };
  } catch (err) {
    console.error("verifyOtp error:", err);
    return { ok: false, message: "OTP verification failed" };
  }
};