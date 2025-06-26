import  Admin  from "../model/admin.model.js";
import { config } from "dotenv";
import { Crypto } from '../utils/encrypte-decrypt.js';
config();

const crypto = new Crypto();

export const createSuperadmin = async () => {
    try {
        const existsSuperAdmin = await Admin.findOne({ role: 'superadmin' });
        if (!existsSuperAdmin) {
            const hashedPassword = await crypto.encrypt(process.env.SUPERADMIN_PASSWORD);
            await Admin.create({
                username: process.env.SUPERADMIN_USERNAME,
                email:"axrorpubgm001@gmail.com",
                phoneNumber: "+998900092083",
                hashedPassword,
                role: 'superadmin'
            });
            console.log(`Superadmin created successfuly`);
        };
    } catch (error) {
        console.log(`Error on creating superadmin ${error}`);
    }
}
