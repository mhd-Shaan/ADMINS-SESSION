import admins from "../models/superadmin.js";
import authHelper from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import { sendAdminCredentials, sendOTP } from "../helpers/emailService.js";
import OTPVerification from "../models/otpScehma.js";
import OtpVerification from "../models/otpScehma.js";

const { hashPassword, comparePassword } = authHelper;

export const registeradmins = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (req.userRole !== "superadmin") {
      return res
        .status(403)
        .json({ error: "Access Denied! Only Super Admin can create Admins." });
    }

    if (!name) return res.status(403).json({ error: "name is required" });
    if (!email) return res.status(403).json({ error: "email is required" });
    if (!password || password.length < 6) {
      return res
        .status(403)
        .json({ error: "password must be at least 6 characters long" });
    }

    const existingemail = await admins.findOne({ email });
    if (existingemail)
      return res.status(403).json({ error: "Email is already taken" });

    const hashedPassword = await hashPassword(password);

    const admin = await admins.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await sendAdminCredentials(email, password);

    return res
      .status(200)
      .send({ msg: `${role} registred sucessfully`, admin });
  } catch (error) {
    console.log(error);
  }
};

export const loginadmins = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!email) return res.status(403).json({ error: "email is required" });
    const user = await admins.findOne({ email });
    if (!user)
      return res.status(403).json({ error: "this email is not registred" });
    if (!password || password.length < 6) {
      return res
        .status(403)
        .json({ error: "password must be at least 6 characters long" });
    }

    if (user.isblock) {
      return res
        .status(403)
        .json({ error: "Your account is blocked. Contact support." });
    }

    const match = await comparePassword(password, user.password);
    if (!match)
      return res.status(403).json({ error: "Enter correct password" });

    jwt.sign(
      { email: user.email, id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;

        res.status(200).json({
          success: true,
          message: "Login successful",
          admin: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getadmins = async (req, res) => {
  try {
    const { page = 1, limit = 10 ,search='',status='all'} = req.query; 
    

    
    const skip = (page - 1) * limit; 
    const searchFilter = {
      role: "admin",
      $or: [
        { name: { $regex: search, $options: "i" } }, 
        { email: { $regex: search, $options: "i" } }, 
      ],
    };


    if (status === "blocked") {
      searchFilter.isblock = true;
    } else if (status === "unblocked") {
      searchFilter.isblock = false;
    }

    const totaladmins = await admins.countDocuments(searchFilter)

    const adminlist = await admins.find(searchFilter).skip(skip).limit(Number(limit));

    res.json({
      totaladmins,
      currentPage: Number(page),
      totalPages: Math.ceil(totaladmins / limit),
       adminlist,
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const blockandunblockadmin = async (req, res) => {
  try {
    const adminId = req.params.id;

    // Find the admin in the database
    const admin = await admins.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    admin.isblock = !admin.isblock;

    await admin.save();

    res.status(200).json({
      success: true,
      message: `Admin ${admin.isblock ? "Blocked" : "Unblocked"} successfully`,
      admin,
    });
  } catch (error) {
    console.error("Error in blockandunblockadmin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Editadmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { name, email } = req.body;

    // Find the admin in the database
    const admin = await admins.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    if (!email) return res.json({ error: "email is required" });
    if (!name) return res.json({ error: "name is required" });

    // Update the name if provided
    if (email) {
      admin.email = email;
    }

    // Hash the password if provided
    if (name) {
      admin.name = name;
    }

    // Save the updated admin details
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Update successful",
      admin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getadminDetails = async (req, res) => {
  try {
    const userId = req.userId; 
    const admin = await admins.findOne({ _id: userId });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Admin details fetched successfully",
      admin,
    });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const Otpsend = async(req,res)=>{
  try {
    const {email}=req.body
    if(!email) return res.status(400).json({error:"email is required"})

      const admin = await admins.findOne({email });
      if (!admin) {
        return res.status(404).json({ error: "this email is not registred" });
    }
    const otpsend = await OtpVerification.findOne({email,userType:'admin'})
    if(otpsend){
      await OTPVerification.deleteOne({ email });
    }
    await sendOTP(email);
    res.status(200).json({ message: "otp sended" });

  } catch (error) {
    console.error("Error send otp :", error);
      res.status(500).json({ error });
  }
}


export const CheckingOtp=async(req,res)=>{
  try {
    const {email,otp}=req.body

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!otp) return res.status(400).json({ error: "OTP is required" });

    const otpRecord = await OTPVerification.findOne({ email,userType:'admin' });
    console.log(otpRecord);

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    if (otpRecord.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    const updatedOtp = await OtpVerification.findOneAndUpdate(
      { email }, 
      { otpisverfied: true }, 
      { new: true } 
    );
    res.status(200).json({ message: " OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP." });
    console.log(error);
  }
} 

export const updatePassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Enter a password" });
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    if (!confirmPassword) return res.status(400).json({ error: "Enter confirm password" });
    if (password !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });

    const admin = await admins.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "This email is not registered" });
    }

    const otpchecking = await OtpVerification.findOne({ email, otpisverfied: true });

    if (!otpchecking) {
      return res.status(400).json({ error: "OTP  verification not completed" });
    }

    const hashedPassword = await hashPassword(password);

    admin.password = hashedPassword;
    await admin.save();

    await OtpVerification.deleteOne({ email });

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



