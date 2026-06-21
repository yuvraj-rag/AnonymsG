// app/u/[username]/page.tsx
//this page checks if username exists in DB before sending msg

import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import SendMessageForm from "./SendMessageForm";

export default async function page({ params }: 
    {params: Promise<{ shareToken: string }>}
) {
    const { shareToken } = await params;

    await dbConnect();

    const user = await UserModel.findOne({ shareToken });

    if (!user) {
        notFound();
    }

    if(!user.isAcceptingMessages) {
        return <div>{user.username} is not accepting messages as of now. Please try later.</div>
    }

    return <SendMessageForm username={user.username} shareToken={shareToken}/>;
}
