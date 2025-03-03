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


// Function to send admin login details via email
export const sendAdminCredentials = async (email, password) => {

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Admin Account Details - Spare Wala',
            html: `
                <h2>Welcome to Spare Wala Admin Panel</h2>
                <p>Your admin account has been created.</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong> Password:</strong> ${password}</p>
                <a href="http://localhost:5173">Login Here</a>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Admin credentials sent successfully');
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};
