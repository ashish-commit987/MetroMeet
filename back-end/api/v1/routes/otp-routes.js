    import express from "express";
    import { sendOtp, verifyOtpAndRegister } from "../../../controllers/auth-controller.js";

    const router = express.Router();

    router.post("/send", sendOtp);    // BODY: { email }
    router.post("/verify", verifyOtpAndRegister);   // BODY: { email, otp }

    export default router;
