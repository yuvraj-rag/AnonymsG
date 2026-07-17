import { ConversationModel } from "@/model/Conversation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ conversationToken: string }> },
) {
    const { conversationToken } = await params;
    const { content } = await request.json();

    const session = await getServerSession(authOptions); //get session
    const user = session?.user; //we injected this earlier using jwt nextauth

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "User Not authenticated",
            },
            { status: 401 },
        );
    }

    if (!(conversationToken && conversationToken.length == 8)) {
        return Response.json(
            {
                success: false,
                message: "Invalid Conversation Link",
            },
            { status: 400 },
        );
    }

    try {
        await dbConnect();

        const conversation = await ConversationModel.findOne({
            conversationToken,
            recipientId: session.user._id
        });
        if (!conversation) {
            return Response.json(
                {
                    success: false,
                    message: "Conversation not found",
                },
                { status: 404 },
            );
        }

        if (conversation.status === "closed") {
            return Response.json(
                {
                    success: false,
                    message: "Conversation is closed",
                },
                { status: 403 },
            );
        }

        const currentTime = new Date();

        conversation.messages.push({
            role: "recipient",
            content,
            createdAt: currentTime,
        });
        conversation.lastActivityAt = currentTime;
        conversation.senderHasUnread = true;

        await conversation.save();

        return Response.json({
            success: true,
            message: "Reply sent successfully",
            sentMessage: conversation.messages.at(-1),
        });
    } catch (error) {
        console.error("Error in replying to conversation");
        return Response.json(
            {
                success: false,
                message: "Failed to reply to conversation",
            },
            { status: 500 },
        );
    }
}
