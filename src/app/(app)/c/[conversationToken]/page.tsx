import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { ConversationModel } from "@/model/Conversation";
import { UserModel } from "@/model/User";
import { ThreadConversation } from "./types";
import SenderConversationThread from "./SenderConversationThread";

export default async function page({
    params,
}: {
    params: Promise<{ conversationToken: string }>;
}) {
    const { conversationToken } = await params;

    if (conversationToken.length !== 8) {
        notFound();
    }

    await dbConnect();

    const conversation = await ConversationModel.findOne({
        conversationToken,
    }).lean();
    if (!conversation) {
        notFound();
    }

    const recipient = await UserModel.findById(conversation.recipientId)
        .select("username")
        .lean();
    if (!recipient) {
        notFound();
    }

    const initialConversation: ThreadConversation = {
        recipientUsername: recipient.username,  
        status: conversation.status,
        messages: conversation.messages.map((message) => ({
            _id: message._id.toString(),
            role: message.role,
            content: message.content,
            createdAt: message.createdAt,
        })),
    };

    return (
        <SenderConversationThread
            initialConversation={initialConversation}
            conversationToken={conversationToken}
        />
    );
}
