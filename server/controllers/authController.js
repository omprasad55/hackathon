import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTamplate.js';


//user register
export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            message: 'Missing details',
            success: false
        })
    }

    try {

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({
                success: false,
                message: 'user already exist'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        //sending welcome email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to AUTH',
            text: `Welcome to AUTH. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOption);

        return res.json({
            success: 'true',
            message: 'user has successfuly loged in'
        })


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }

}


//user login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            message: 'email and password are reqired',
            success: false
        })
    }

    try {

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid email'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({
                success: false,
                message: 'Invalid password'
            })
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        return res.json({
            success: true,
            message: 'user has successfuly loged in'
        })



    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}


//user logout
export const logout = async (req, res) => {


    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({ success: true, message: 'Logged Out' })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


//send verification OTP to User's Email
export const sendVerifyOtp = async (req, res) => {
    try {

        const userId = req.user;



        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: 'Account Already Verified'
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;

        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `your OTP is ${otp}, verify the account using this OTP`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOption);


        return res.json({
            success: 'true',
            message: 'verification OTP sent on email'
        })


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


//verify the OTP sent to User's Email
export const verifyEmail = async (req, res) => {

    const userId = req.user;
    const { otp } = req.body;



    if (!userId || !otp) {
        return res.json({
            success: false,
            message: 'Missing Details'
        })
    }


    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })

        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {

            return res.json({
                success: false,
                message: 'Invailed OTP'
            })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: 'OTP Expired'
            })
        }


        user.isAccountVerified = true;

        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;



        await user.save();

        return res.json({
            success: true,
            message: 'email verified succesfully'
        })


    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


//check if user is Authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


//send password reset OTP
export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({
            success: false,
            message: 'Email is required'
        })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `your OTP for reseting the password is ${otp}, Use this OTP for further proceed fro resetting the password`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOption);


        return res.json({
            success: true,
            message: 'OTP sent to your email'
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }

}


//verify Reset Password OTP
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: 'Email , OTP , and new Password is reqired'
        })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: 'Invalid OTP'
            })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: 'OTP Expired'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({
            success: true,
            message: 'Password has reset successfully'
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}