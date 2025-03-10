import admins from "../models/superadmin.js";
import authHelper from '../helpers/auth.js'
import jwt from "jsonwebtoken";
import {sendAdminCredentials} from '../helpers/emailService.js'


const {hashPassword,comparePassword}=authHelper

export const registeradmins = async (req, res) => {
  try {
    const { name, email, password ,role} = req.body;

    if (req.userRole !== "superadmin") {
      return res.status(403).json({ error: "Access Denied! Only Super Admin can create Admins." });
    }

    if (!name) return res.status(403).json({ error: "name is required" });
    if (!email) return res.status(403).json({ error: "email is required" });
    if (!password || password.length < 6) {
      return res.status(403).json({ error: "password must be at least 6 characters long" });
    }

    const existingemail = await admins.findOne({email})
    if(existingemail) return res.status(403).json({error:"Email is already taken"})

    const hashedPassword = await hashPassword(password);

    const admin = await admins.create({ name, email, password:hashedPassword,role });
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
    const { password, email} = req.body;
    if (!email) return res.status(403).json({ error: "email is required" });
    const user = await admins.findOne({email})
    if(!user) return res.status(403).json({error:"this email is not registred"})
    if (!password || password.length < 6) {
      return res.status(403).json({ error: "password must be at least 6 characters long" });
    }
   
    if (user.isblock) {
      return res.status(403).json({ error: "Your account is blocked. Contact support." });
    }

const match = await comparePassword(password,user.password)
if(!match) return res.status(403).json({error:"Enter correct password"})

jwt.sign({email:user.email,id:user.id,name:user.name,role:user.role},process.env.JWT_SECRET,{},(err,token)=>{
  if(err) throw err;
  
  res.status(200).json({
    success: true,
    message: "Login successful",
    admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    },
    token
});
})

  } catch (error) {
    console.log(error);
  }
};

export const getadmins = async (req,res)=>{
  try {
    // const adminid = user.id;
const adminlist = await admins.find({role:"admin"})
res.json(adminlist)

  } catch (error) {
    console.log("error",error);
    
  }
}


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
      return res.status(404).json({ success: false, message: "Admin not found" });
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
      
    })


  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getadminDetails = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from JWT token
    const admin = await admins.findOne({ _id: userId }); // ✅ Correct usage

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
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
