import { ConversationModel } from "@/model/Conversation";
import { UserModel } from "@/model/User";


export async function GET(request: Request, { params }: {params: Promise<{conversationToken: string}>}) {
    const {conversationToken} = await params;
    
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

        const recipient = await UserModel.findById({ _id: conversation.recipientId });
        if (!recipient) {
            return Response.json(
                {
                    success: false,
                    message: "Recipient not found",
                },
                { status: 404 },
            );
        }

        if(conversation.senderHasUnread){
            conversation.senderHasUnread = false;
            await conversation.save();
        }

        return Response.json({
            success: true,
            status: conversation.status,
            recipientUsername: recipient.username,
            messages: conversation.messages,
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