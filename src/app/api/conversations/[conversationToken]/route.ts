import { ConversationModel } from "@/model/Conversation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ conversationToken: string }> },
) {
    const { conversationToken } = await params;

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

    if (!conversationToken || conversationToken.length !== 8) {
        return Response.json(
            {
                success: false,
                message: "Invalid conversation link",
            },
            { status: 400 },
        );
    }

    try {
        await dbConnect();

        const conversation = await ConversationModel.findOne({
            conversationToken,
            recipientId: session.user._id, // only current user can open this conv
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

        if (conversation.recipientHasUnread) {
            conversation.recipientHasUnread = false;
            await conversation.save();
        }

        return Response.json({
            success: true,
            status: conversation.status,
            messages: conversation.messages,
        });
    } catch (error) {
        console.error("Error in fetching conversation");
        return Response.json(
            {
                success: false,
                message: "Failed to get conversation",
            },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ conversationToken: string }> },
) {
    const { conversationToken } = await params;

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

    if (!conversationToken || conversationToken.length !== 8) {
        return Response.json(
            {
                success: false,
                message: "Invalid conversation link",
            },
            { status: 400 },
        );
    }

    try {
        await dbConnect();

        const conversation = await ConversationModel.findOne({
            conversationToken,
            recipientId: session.user._id, // only current user can open this conv
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

        if (conversation.status === "open") {
            conversation.status = "closed";
        } else {
            conversation.status = "open";
        }
        await conversation.save();

        return Response.json({
            success: true,
            status: conversation.status,
            message: "Conversation status set successfully",
        });
    } catch (error) {
        console.error("Error in setting conversation status");
        return Response.json(
            {
                success: false,
                message: "Failed to set conversation status",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ conversationToken: string }> },
) {
    const { conversationToken } = await params;
    const session = await getServerSession(authOptions); //get session
    const user = session?.user; //we injected this earlier using jwt nextauth

    if (!conversationToken || conversationToken.length !== 8) {
        return Response.json(
            {
                success: false,
                message: "Invalid conversation link",
            },
            { status: 400 },
        );
    }

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "User Not authenticated",
            },
            { status: 401 },
        );
    }

    try {
        await dbConnect();

        const deletedConversation = await ConversationModel.findOneAndDelete({
            conversationToken,
            recipientId: session.user._id,
        });

        if (!deletedConversation) {
            return Response.json(
                {
                    success: false,
                    message: "Conversation not found",
                },
                { status: 404 },
            );
        }

        return Response.json(
            {
                success: true,
                message: "Conversation successfully deleted",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error in deleting conv", error);
        return Response.json(
            {
                success: false,
                message: "Failed to delete conversation",
            },
            { status: 500 },
        );
    }
}
