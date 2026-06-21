import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import mongoose from "mongoose";

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
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' }, //earlier -> one document with messages array, now -> multiple documents with one msg each
            { $sort: {'messages.createdAt': -1} },
            { $group: {_id: '$_id', messages: {$push: '$messages'}} }, // combined back in sorted way
        ])
        //above method is old
        // newer method to sort arrays -> $sortArray

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 401}
            )
        }

        //user[0] wont exist if zero messages. hence we use '?'
        return Response.json(
            {
                success: true,
                messages: user[0]?.messages || []
            },
            { status: 200}
        )
    } catch (error) {
        console.log("Error in fetching accept message status")
        return Response.json(
            {
                success: false,
                message: "Failed to get user accepting messages status"
            },
            { status: 500}
        )
    }
}