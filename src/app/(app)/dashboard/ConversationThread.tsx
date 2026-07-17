"use client";

import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { X, MoreVertical, Send, Trash2, Archive, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Message = {
    _id: string;
    role: "sender" | "recipient";
    content: string;
    createdAt: string;
};

type ConversationThreadProps = {
    conversationToken: string;
    onClose: () => void;
    refreshConversations: () => void;
};

const ConversationThreadSkeleton = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <Card className="flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-9 rounded-md" />
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 p-4">
                <Skeleton className="h-16 w-2/3 rounded-xl" />
                <Skeleton className="ml-auto h-16 w-1/2 rounded-xl" />
                <Skeleton className="h-16 w-3/4 rounded-xl" />
                <Skeleton className="ml-auto h-14 w-2/5 rounded-xl" />
            </div>

            {/* Reply */}
            <div className="border-t p-4 flex gap-2">
                <Skeleton className="h-20 flex-1" />
                <Skeleton className="h-10 w-10 rounded-md" />
            </div>
        </Card>
    </div>
);

const ConversationThread = ({
    conversationToken,
    onClose,
    refreshConversations,
}: ConversationThreadProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<"open" | "closed">("closed");

    const [fetchingConversation, setFetchingConversation] = useState(true);
    const [isSendingReply, setisSendingReply] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    });

    const initialFetchConversation = async () => {
        try {
            await fetchConversation();
        } finally {
            setFetchingConversation(false);
        }
    };

    const fetchConversation = useCallback(async () => {
        try {
            const response = await axios.get(
                `/api/conversations/${conversationToken}`,
            );

            setMessages(response.data.messages || []);
            setStatus(response.data.status);
        } catch (error) {
            toast.error("Failed to load conversation");
        }
    }, [conversationToken]);

    useEffect(() => {
        initialFetchConversation();
        const interval = setInterval(() => {
            fetchConversation();
        }, 15000);

        return () => clearInterval(interval);
    }, [fetchConversation]);

    const deleteConversation = async () => {
        setIsDeleting(true);

        try {
            await axios.delete(`/api/conversations/${conversationToken}`);

            toast.success("Conversation deleted");

            refreshConversations();
            onClose();
        } catch {
            toast.error("Failed to delete conversation");
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleConversationStatus = async () => {
        try {
            const response = await axios.patch(
                `/api/conversations/${conversationToken}`,
                {
                    status,
                },
            );
            const newStatus = response.data.status;
            setStatus(newStatus);

            if (newStatus === "closed") {
                toast.info("Conversation closed");
            } else {
                toast.success("Conversation reopened");
            }

            refreshConversations();
        } catch {
            toast.error("Failed to update conversation status");
        }
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setisSendingReply(true);

        try {
            const response = await axios.post(
                `/api/conversations/${conversationToken}/reply`,
                {
                    content: data.content,
                },
            );

            setMessages((prev) => [...prev, response.data.sentMessage]);

            form.reset({
                content: "",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.message);
        } finally {
            setisSendingReply(false);
        }
    };

    if (fetchingConversation) {
        return <ConversationThreadSkeleton />;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete conversation?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete this conversation and
                            all of its messages. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={deleteConversation}
                            disabled={isDeleting}
                            className="bg-destructive text-white hover:bg-destructive/90 transition-colors"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Conversation"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card className="flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-semibold">Anonymous sender</h2>

                    <div className="flex gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none">
                                <MoreVertical className="h-5 w-5" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={toggleConversationStatus}
                                >
                                    <Archive className="mr-2 h-4 w-4" />
                                    {status === "closed" ? "Open" : "Close"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {messages.map((message) => (
                        <div
                            key={message._id}
                            className={`flex ${
                                message.role === "sender"
                                    ? "justify-start"
                                    : "justify-end"
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

                {/* REPLY */}
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
                                            placeholder="Type a reply..."
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
                                disabled={isSendingReply}
                            >
                                {isSendingReply ? (
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
};

export default ConversationThread;
