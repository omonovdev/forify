import jwt from "jsonwebtoken";
import { resError } from "../helpers/resError.js";

export const AuthGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return resError(res, "Token kerak", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        req.user = decoded; 
        next();
    } catch (err) {
        return resError(res, "Yaroqsiz token", 403);
    }
};
