import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { ConversationModel } from "@/model/Conversation";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions); //get session
    const user = session?.user; //we injected this earlier using jwt nextauth

    if(!session || !user) {
        return Response.json(
            {
                success: false,
                message: "User Not authenticated"
            },
            { status: 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id); //for aggregation pipeline
        
    try {
        const conversations = await ConversationModel.aggregate([
            { $match: { recipientId: userId } },
            { $sort: {
                lastActivityAt: -1 // sort according to lastactivity
            } },
            { $project: {
                conversationToken: 1,
                status: 1,
                recipientHasUnread: 1,
                lastActivityAt: 1,
                lastMessage: {
                    $arrayElemAt: ["$messages",-1]
                }
            } }
        ])

        // newer method to sort arrays -> $sortArray

        //user[0] wont exist if zero messages. hence we use '?'
        return Response.json(
            {
                success: true,
                conversations
            },
            { status: 200}
        )
    } catch (error) {
        console.error("Error in fetching conversations")
        return Response.json(
            {   
                success: false,
                message: "Failed to get conversations"
            },
            { status: 500}
        )
    }
}