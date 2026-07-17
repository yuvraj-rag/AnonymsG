import crypto from "crypto";

export const generateToken = () => {
    return crypto.randomBytes(6)
                .toString("base64url")
                .slice(0,8);
}