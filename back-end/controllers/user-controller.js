import { register as registerUser, login as loginUser } from "../services/user-service.js";
import { isAllowedDomain, isDisposable } from "../utils/services/email-check.js";
import { createAndSendOtp } from "../utils/services/otp-service.js";
import { userModel } from "../models/user-model.js";

export const login=async (req,res)=>{
    const userObject = req.body;
    try{
       const obj=await loginUser(userObject);
       res.status(200).json(obj);
       //res.json({message:'Login '});
    }
    catch(err){
        res.status(500).json({message:'Login Fail Server Crash...'});
        console.log(err);
    }   
}

export const register = async (req, res) => {
  console.log("Data rec ", req.body);

  const userObject = req.body;  //dynamic fields
  const { email } = userObject;

  // Check disposable
  if (isDisposable(email)) {
    return res.status(400).json({
      message: "Temporary / Disposable email addresses are not allowed."
    });
  }

  // Check allowed provider
  if (!isAllowedDomain(email)) {
    return res.status(400).json({
      message:
        "Email provider not supported. Use valid mail providers like Gmail, Yahoo, Outlook, Hotmail, or ProtonMail."
    });
  }

  try {
    // Prevent double registration
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Email already registered. Please login." });
    }

    // Send OTP (but DO NOT create user here)
    await createAndSendOtp(email);

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete registration.",
      data: userObject 
    });
  } catch (err) {
    console.log("Register Error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration." });
  }
};

export const profile=(req,res)=>{
    res.json({message:'Profile '});
}
