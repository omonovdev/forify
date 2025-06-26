import { resError } from "../helpers/resError.js";
import { resSuccses } from "../helpers/resSuccess.js";
import Admin from "../model/admin.model.js";
import { Crypto } from "../utils/encrypte-decrypt.js";
import { isValidObjectId } from "mongoose";
import {
    createvalidator,
    updateValidator,
    signInAdminvalidator
} from "../validation/admin.validation.js";
import { Token } from "../utils/token-service.js";
import { config } from "dotenv";
import NodeCache from "node-cache";
import { generateOTP } from "../helpers/generete-otp.js";
import { transporter } from "../helpers/send-mail.js";
config();

const cache = new NodeCache();
const crypto = new Crypto();
const token = new Token();

export class adminController {
    async createAdmin(req, res) {
        try {
            const { value, error } = createvalidator(req.body);
            if (error) return resError(res, error, 422);

            const existsAdmin = await Admin.findOne({ username: value.username });
            if (existsAdmin) return resError(res, 'Username already exists', 409);

            const hashedPassword = await crypto.encrypt(value.password);

            const admin = await Admin.create({
                username: value.username,
                email: value.email,
                phoneNumber: value.phoneNumber,
                hashedPassword,
            });

            return resSuccses(res, admin, 201);
        } catch (error) {
            return resError(res, error);
        }
    }
    async verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) return resError(res, 'Email va OTP talab qilinadi', 400);

        const cachedOtp = cache.get(email);

        if (!cachedOtp) return resError(res, 'OTP muddati tugagan yoki noto‘g‘ri', 400);
        if (cachedOtp !== otp) return resError(res, 'Noto‘g‘ri OTP', 401);

        const admin = await Admin.findOne({ email });
        if (!admin) return resError(res, 'Admin topilmadi', 404);

        const accessToken = await token.generateAccessToken({ id: admin._id, role: admin.role });
        const refreshToken = await token.generateRefreshToken({ id: admin._id, role: admin.role });

        res.cookie('refreshTokenAdmin', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        cache.del(email);

        return resSuccses(res, {
            message: 'Kirish muvaffaqiyatli',
            token: accessToken
        });

    } catch (error) {
        return resError(res, error);
    }
}

    async signIn(req, res) {
    try {
        const { value, error } = signInAdminvalidator(req.body);
        if (error) return resError(res, error, 422);

        const admin = await Admin.findOne({ username: value.username });
        if (!admin) return resError(res, "Username or password incorrect", 404);

        const isMatch = await crypto.decrypt(value.password, admin.hashedPassword);
        if (!isMatch) return resError(res, "Username or password incorrect", 400);

        if (!admin.email) return resError(res, "Admin email mavjud emas", 500);

        const otp = generateOTP();

        const mailOptions = {
            from: config.MAIL_USER,
            to: admin.email,
            subject: 'Florify OTP Code',
            text: `Your OTP code is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        cache.set(admin.email, otp, 300);
        return resSuccses(res, {
            message: "OTP sent to email. Please confirm.",
            userId: admin._id,
            email: admin.email
        });

    } catch (error) {
        console.error(error);
        return resError(res, "Failed to send OTP", 500);
    }
}


    async newAccessToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) return resError(res, 'Refresh token expired', 400);

            const decodedToken = await token.verifyToken(refreshToken, process.env.REFRESH_TOKEN_KEY);
            if (!decodedToken) return resError(res, 'Invalid Token', 400);

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) return resError(res, 'Admin not found', 404);

            const accessToken = await token.generateAccessToken({ id: admin._id, role: admin.role });
            return resSuccses(res, { token: accessToken });
        } catch (error) {
            return resError(res, error);
        }
    }

    async logOut(req, res) {
        try {
            res.clearCookie('refreshTokenAdmin');
            return resSuccses(res, { message: 'Logged out successfully' });
        } catch (error) {
            return resError(res, error);
        }
    }

    async getAlladmins(req, res) {
        try {
            const admins = await Admin.find();
            return resSuccses(res, admins);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getByIDAdmin(req, res) {
        try {
            const admin = await adminController.FindByIdAdmin(res, req.params.id);
            return resSuccses(res, admin);
        } catch (error) {
            return resError(res, error);
        }
    }

    async UpdateById(req, res) {
        try {
            const id = req.params.id;
            const admin = await adminController.FindByIdAdmin(res, id);

            const { value, error } = updateValidator(req.body);
            if (error) return resError(res, error, 422);

            let hashedPassword = admin.hashedPassword;
            if (value.password) {
                hashedPassword = await crypto.encrypt(value.password);
            }

            const updatedAdmin = await Admin.findByIdAndUpdate(id, {
                ...value,
                hashedPassword
            }, { new: true });

            return resSuccses(res, updatedAdmin);
        } catch (error) {
            return resError(res, error);
        }
    }

    async deleteById(req, res) {
        try {
            const id = req.params.id;
            await adminController.FindByIdAdmin(res, id);
            await Admin.findByIdAndDelete(id);
            return resSuccses(res, { message: 'Admin deleted' });
        } catch (error) {
            return resError(res, error);
        }
    }

    static async FindByIdAdmin(res, id) {
        if (!isValidObjectId(id)) return resError(res, 'Invalid Object Id', 400);

        const admin = await Admin.findById(id);
        if (!admin) return resError(res, 'Admin not found', 404);

        return admin;
    }
}
