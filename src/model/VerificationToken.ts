import mongoose, { Schema, Document, Types } from "mongoose";

export interface VerificationToken extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    expiresAt: Date;
}

const VerificationTokenSchema: Schema<VerificationToken> = new Schema({
    username: {
        type: String,
        required: [true,"Username is required"], //custom msg
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true,"Email required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Please user valid email']
    },
    password: {
        type: String,
        required: [true,"Password required"]
    },

    verifyCode: {
        type: String,
        required: true,
    },

    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
});

export const VerificationTokenModel =
    (mongoose.models.VerificationToken as mongoose.Model<VerificationToken>) ||
    mongoose.model<VerificationToken>(
        "VerificationToken",
        VerificationTokenSchema
    );