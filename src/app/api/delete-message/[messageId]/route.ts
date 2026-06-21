import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export async function DELETE(request: Request, {params}: {params: Promise<{messageId: string}>}) {
    await dbConnect();

    const {messageId} = await params;
    const session = await getServerSession(authOptions); //get session
    const user = session?.user; //we injected this earlier using jwt nextauth
    
    if(!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }
    
    try {
        const updatedUser = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {
                messages:{
                    _id: messageId
                }
            }}
        )

        if(updatedUser.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found"
                },
                { status: 404}
            )
        }

        return Response.json(
            {
                success: true,
                messages: "Message successfully deleted"
            },
            { status: 200}
        )
    } catch (error) {
        console.log("Error in deleting msg", error)
        return Response.json(
            {
                success: false,
                message: "Failed to delete message"
            },
            { status: 500}
        )
    }
}