import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    shareToken: string,
    isAcceptingMessages: boolean,
    messages: Message[]  
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
        unique: true
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)