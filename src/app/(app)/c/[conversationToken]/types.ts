
export type ThreadMessage = {
    _id: string;
        role: "sender" | "recipient";
        content: string;
        createdAt: Date;
}

export type ThreadConversation = {
    recipientUsername: string;
    status: "open" | "closed";
    messages: ThreadMessage[]
}