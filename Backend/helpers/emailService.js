import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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





export const sendOTPEmail = async (email, otp) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Password Reset - Spare Wala",
        html: `
          <h2>Password Reset OTP</h2>
          <p>Your OTP for resetting your password is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 5 minutes.</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      console.log("✅ OTP sent successfully");
    } catch (error) {
      console.error("❌ Error sending OTP email:", error);
    }
  };