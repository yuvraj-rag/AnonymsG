// app/u/[username]/page.tsx
//this page checks if username exists in DB before sending msg

import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import SenderPageClient from "./SenderPageClient";
import { Recipient } from "./types";

export default async function page({ params }: 
    {params: Promise<{ shareToken: string }>}
) {
    const { shareToken } = await params;

    await dbConnect();

    const user = await UserModel.findOne({ shareToken });

    if (!user) {
        notFound();
    }

    const recipient: Recipient = {
        username: user.username,
        isAcceptingMessages: user.isAcceptingMessages,
        shareToken: shareToken
    }

    return <SenderPageClient recipient={recipient}/>;
}
