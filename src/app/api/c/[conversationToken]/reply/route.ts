import { ConversationModel } from "@/model/Conversation";

export async function POST(request: Request, { params }: {params: Promise<{conversationToken: string}>}) {
    const {conversationToken} = await params;
    const { content } = await request.json();
    
    if(!(conversationToken && conversationToken.length == 8) ) {
        return Response.json({
            success: false,
            message: "Invalid Conversation Link"
        }, {status: 400})
    }

    try {
        const conversation = await ConversationModel.findOne({ conversationToken });
        if (!conversation) {
            return Response.json(
                {
                    success: false,
                    message: "Conversation not found",
                },
                { status: 404 },
            );
        }

        if(conversation.status === "closed"){
            return Response.json(
                {
                    success: false,
                    message: "Conversation is closed by the recipient",
                },
                { status: 403 },
            );
        }

        const currentTime = new Date();

        conversation.messages.push({
            role: "sender",
            content,
            createdAt: currentTime
        });
        conversation.lastActivityAt = currentTime;
        conversation.recipientHasUnread = true;

        await conversation.save();

        return Response.json({
            success: true,
            message: "Reply sent successfully",
            sentMessage: conversation.messages.at(-1)
        })


    } catch (error) {
        console.error("Error in fetching conversation")
        return Response.json(
            {
                success: false,
                message: "Failed to get conversation"
            },
            { status: 500}
        )
    }


}