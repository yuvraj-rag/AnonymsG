"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import SendMessageForm from "./SendMessageForm";
import { Recipient } from "./types";

type SenderPageClientProps = {
    recipient: Recipient;
};

type View = "prompt" | "new";

export default function SenderPageClient({
    recipient,
}: SenderPageClientProps) {
    const router = useRouter();

    const [view, setView] = useState<View>("new");
    const [checkedStorage, setCheckedStorage] = useState(false);
    const [conversationToken, setConversationToken] = useState<string | null>(
        null,
    );

    useEffect(() => {
        const checkExistingConversation = async () => {
            const savedConversation = localStorage.getItem(
                `conv_${recipient.shareToken}`,
            );

            if (!savedConversation) {
                setView("new");
                setCheckedStorage(true);
                return;
            }

            try {
                await axios.get(`/api/c/${savedConversation}`);

                setConversationToken(savedConversation);
                setView("prompt");
            } catch {
                localStorage.removeItem(`conv_${recipient.shareToken}`);

                setConversationToken(null);
                setView("new");
            } finally {
                setCheckedStorage(true);
            }
        };

        checkExistingConversation();
    }, [recipient.shareToken]);

    if (!checkedStorage) {
        return null;
    }

    if (view === "prompt") {
        return (
            <div className="rounded-lg border p-6 text-center">
                <p className="mb-4 text-muted-foreground">
                    You already have an existing conversation with{" "}
                    <strong>{recipient.username}</strong>.
                </p>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={() =>
                            router.push(`/c/${conversationToken}`)
                        }
                        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:cursor-pointer hover:bg-gray-500 transition-colors duration-350"
                    >
                        Continue conversation
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem(
                                `conv_${recipient.shareToken}`,
                            );

                            setConversationToken(null);
                            setView("new");
                        }}
                        className="rounded-md border px-4 py-2 hover:cursor-pointer hover:bg-gray-200 transition-colors duration-350"
                    >
                        Start new conversation
                    </button>
                </div>
            </div>
        );
    }

    return <SendMessageForm recipient={recipient} />;
}