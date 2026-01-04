import {userModel} from "../models/user-model.js";
import { compareHash,encryptPassword } from "../utils/services/password-hash.js";
import { generateToken } from "../utils/services/token.js";

export const register=async(userObject)=>{
    try{
        userObject.password=encryptPassword(userObject.password);
        const doc =await userModel.create(userObject);
        if(doc && doc._id){
            return "User Registered Successfully";
        }
    }
    catch(err){
        throw err;
    }
}

export const login = async (userObject) => {
  try {
    const user = await userModel.findOne({ email: userObject.email }).exec();

    //User not found
    if (!user) {
      return {
        success: false,
        message: "User not registered. Please register first."
      };
    }

    //Password incorrect
    const isMatch = compareHash(userObject.password, user.password);

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid email or password."
      };
    }

    //Login success
    const token = generateToken(user.email);

    return {
      success: true,
      message: "Welcome " + user.name,
      role: user.role,
      token,
      userId: user._id.toString(),
      name: user.name 
    };

  } catch (err) {
    console.error("Login Error:", err);
    return {
      success: false,
      message: "Server error during login."
    };
  }
};
