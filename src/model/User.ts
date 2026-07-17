import mongoose, { Schema, Document } from "mongoose";


export interface User extends Document {
    username: string,
    email: string,
    password: string,
    shareToken: string,
    isAcceptingMessages: boolean 
}

const UserSchema: Schema<User> = new Schema({
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
    shareToken: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)