import mongoose, { Schema, Document, Types } from "mongoose";

export interface Message {
    role: "sender" | "recipient";
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    role: {
        type: String,
        enum: ["sender","recipient"],
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export interface Conversation extends Document {    
    recipientId: mongoose.Types.ObjectId;
    conversationToken: string;
    status: "open" | "closed";
    messages: Types.DocumentArray<Message>;
    recipientHasUnread: boolean;
    senderHasUnread: boolean;
    lastActivityAt: Date;
    createdAt: Date;
}

const ConversationSchema: Schema<Conversation> = new Schema({
    recipientId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        conversationToken: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open",
            required: true
        },

        messages: {
            type: [MessageSchema],
            default: []
        },

        recipientHasUnread: {
            type: Boolean,
            default: true    
        },

        senderHasUnread: {
            type: Boolean,
            default: false 
        },

        lastActivityAt: {
            type: Date,
            default: Date.now
        },

        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true
        }
},{timestamps: false})

// dashboard query — all conversations for a recipient, newest first
ConversationSchema.index({ recipientId: 1, lastActivityAt: -1 })

export const ConversationModel = (mongoose.models.Conversation as mongoose.Model<Conversation>) ||
    mongoose.model<Conversation>(
        "Conversation",
        ConversationSchema
    );