import { Message } from "@/model/Conversation";


export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages: boolean;
    messages?: Array<Message>
}