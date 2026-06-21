import crypto from "crypto";

export const generateShareToken = () => {
    return crypto.randomBytes(6)
                .toString("base64url")
                .slice(0,8);
}