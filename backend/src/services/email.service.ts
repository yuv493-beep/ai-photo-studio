import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = `http://localhost:${process.env.PORT || 8080}`;

/**
 * MOCK EMAIL SERVICE
 * In a real application, this service would use a library like `nodemailer` 
 * to send actual emails to users. For this project, we log the email content
 * to the console for easy development and testing.
 */

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
    const verificationUrl = `${process.env.CLIENT_URL}/email-verified`; // The backend handles the token
    
    console.log('--- [MOCK EMAIL SERVICE]: Sending Verification Email ---');
    console.log(`To: ${email}`);
    console.log('Subject: Verify Your Email Address for AI Studio');
    console.log('Body:');
    console.log('Please click the following link to verify your email address:');
    console.log(`${API_BASE_URL}/api/auth/verify-email/${token}`); // User clicks this link
    console.log(`(This will redirect to: ${verificationUrl})`);
    console.log('----------------------------------------------------');

    await new Promise(resolve => setTimeout(resolve, 100));
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    
    console.log('--- [MOCK EMAIL SERVICE]: Sending Password Reset Email ---');
    console.log(`To: ${email}`);
    console.log('Subject: Reset Your AI Studio Password');
    console.log('Body:');
    console.log('Please click the following link to reset your password:');
    console.log(resetUrl);
    console.log('----------------------------------------------------');

    await new Promise(resolve => setTimeout(resolve, 100));
};
