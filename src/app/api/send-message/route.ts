import { generateToken } from "@/helpers/generateToken";
import dbConnect from "@/lib/dbConnect";
import { ConversationModel } from "@/model/Conversation";
import { UserModel } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const {shareToken, content} = await request.json()
    try {
        const user = await UserModel.findOne({shareToken});

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "Link Expired"
                },
                { status:404 }
            )
        }

        //if user is not accepting msgs
        if(!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User not accepting msgs"
                },
                { status:403}
            )
        }

        const newConversation = new ConversationModel({
            recipientId: user._id,
            conversationToken: generateToken(),
            messages: [
                {
                    role: "sender",
                    content,
                    createdAt: new Date(),
                },
            ],
            recipientHasUnread: true,
            senderHasUnread: false,
        });

        await newConversation.save();

        return Response.json(
            {
                success:true,
                message: "Message sent successfully.",
                conversationToken: newConversation.conversationToken
            },
            {status: 200}
        )

    } catch (error) {
        console.error("Unexpected error while sending msgs: ",error);
        return Response.json(
            {
                success: false,
                message: "Unexpected Error Occured while sending message"
            },
            {status: 500}
        )
    }

}