import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from "crypto";
import OtpVerification from '../models/otpScehma.js';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        
    },
    
});



export const sendAdminCredentials = async (email, password) => {
  try {
    const mailOptions = {
      from: `"Spare Wala Support" <no-reply@sparewala.com>`, // Use a business email
      to: email,
      subject: 'Your Admin Dashboard Access - Spare Wala',
      text: `Hello,\n\nWelcome to Spare Wala Admin Dashboard.\n\nYour login details:\nEmail: ${email}\nAccess Code: ${password}\n\nIf this wasn't requested by you, please ignore it.\n\nBest Regards,\nSpare Wala Team`,
      html: `
        <h2>Welcome to Spare Wala Admin Panel</h2>
        <p>Dear Admin,</p>
        <p>Your admin dashboard has been set up successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Secure Access Code:</strong> ${password}</p>
        <p>If this wasn't requested by you, please ignore it.</p>
        <p>Best Regards,</p>
        <p><strong>Spare Wala Team</strong></p>
      `,

    };


    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', result.response);

  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};


export const sendOTP = async (email) => {
  try {
    if (!email) throw new Error("Email is required");
    
    console.log(`Sending OTP to: ${email}`);

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 mins

    await OtpVerification.findOneAndUpdate(
      { email },
      { otp,userType:"admin", expiresAt },
      { upsert: true, new: true }
    );

  
    transporter.verify((error, success) => {
      if (error) {
        console.error("Nodemailer Transporter Error:", error);
      } else {
        console.log("Mail server is ready to send emails");
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    const emailResponse = await transporter.sendMail(mailOptions);
    

    return { message: "OTP sent to email successfully" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Please try again.");
  }
};



  // // **Define the transporter inside the function**
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
   
        
    //   },
    // });    

    // Verify the transporter
