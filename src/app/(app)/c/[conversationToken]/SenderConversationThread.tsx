"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError } from "@/components/ui/field";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { ThreadConversation, ThreadMessage } from "./types";
import { useRouter } from "next/navigation";

type SenderConversationThreadProps = {
    initialConversation: ThreadConversation;
    conversationToken: string;
};

export default function SenderConversationThread({
    initialConversation,
    conversationToken,
}: SenderConversationThreadProps) {
    const router = useRouter();

    const [messages, setMessages] = useState<ThreadMessage[]>(
        initialConversation.messages,
    );

    const [status, setStatus] = useState<"open" | "closed">(
        initialConversation.status,
    );

    const [isSending, setIsSending] = useState(false);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    });

    const applyConversation = (data: {
        messages: ThreadMessage[];
        status: "open" | "closed";
    }) => {
        setMessages(data.messages);
        setStatus(data.status);
    };

    const fetchConversation = async () => {
        try {
            const response = await axios.get(`/api/c/${conversationToken}`);

            applyConversation(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                toast.error("Conversation no longer exists.");
                router.refresh();
                return;
            }

            toast.error("Failed to load conversation");
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchConversation, 10000);

        return () => clearInterval(interval);
    }, [conversationToken]);

    const replyContent = form.watch("content");

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSending(true);

        try {
            await axios.post(`/api/c/${conversationToken}/reply`, {
                content: data.content,
            });

            form.reset({
                content: "",
            });

            await fetchConversation();
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast.error(
                axiosError.response?.data.message ?? "Failed to send reply",
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="w-full p-4">
            <Card className="flex h-[80vh] w-full flex-col overflow-hidden">
                {/* Header */}

                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-semibold">
                        {initialConversation.recipientUsername}
                    </h2>

                    {status === "closed" && (
                        <span className="text-sm text-muted-foreground">
                            Closed
                        </span>
                    )}
                </div>

                {/* Messages */}

                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {messages.map((message) => (
                        <div
                            key={String(message._id)}
                            className={`flex ${
                                message.role === "sender"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[75%] rounded-xl px-4 py-2 text-sm ${
                                    message.role === "sender"
                                        ? "bg-muted"
                                        : "bg-primary text-primary-foreground"
                                }`}
                            >
                                <p>{message.content}</p>

                                <span className="mt-1 block text-xs opacity-60">
                                    {new Date(
                                        message.createdAt,
                                    ).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply */}

                <div className="border-t p-4">
                    {status === "open" ? (
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex items-end gap-2"
                        >
                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="flex-1"
                                    >
                                        <Textarea
                                            {...field}
                                            id="replyBox"
                                            className="resize-none"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Type a msg..."
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter" &&
                                                    !e.shiftKey
                                                ) {
                                                    e.preventDefault();
                                                    form.handleSubmit(
                                                        onSubmit,
                                                    )();
                                                }
                                            }}
                                        />

                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            <Button
                                type="submit"
                                size="icon"
                                disabled={isSending || !replyContent.trim()}
                            >
                                {isSending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </form>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground">
                            This conversation is closed.
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
}
