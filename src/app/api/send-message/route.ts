import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { Message } from "@/model/User";

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

        //if user is accepting msgs
        if(!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User not accepting msgs"
                },
                { status:403}
            )
        }
        // we need to assert that this is of type Message in order to push it
        const newMessage: Message = {content, createdAt: new Date()} as Message
        user.messages.push(newMessage);
        await user.save();

        return Response.json(
            {
                success:true,
                message: "Message sent successfully"
            },
            {status: 200}
        )

    } catch (error) {
        console.log("Unexpected error while adding msgs: ",error);
        return Response.json(
            {
                success: false,
                message: "Unexpected Error Occured while adding messages"
            },
            {status: 500}
        )
    }

}