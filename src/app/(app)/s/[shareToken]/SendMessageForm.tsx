"use client";

import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Recipient } from "./types";
import { useRouter } from "next/navigation";

const DEFAULT_SUGGESTIONS = [
    "What's a small thing that instantly improves your day?",
    "If you could master any skill overnight, what would it be?",
    "What's something most people should try at least once?",
];

const QUESTION_CATEGORIES = [
    "random",
    "fun",
    "creative",
    "deep",
    "spicy",
] as const;

const SendMessageForm = ({ recipient }: { recipient: Recipient }) => {
    const receivingUser = recipient.username;
    const receivingUserShareToken = recipient.shareToken;
    const [isSending, setIsSending] = useState(false);
    const [suggestions, setSuggestions] =
        useState<string[]>(DEFAULT_SUGGESTIONS);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [category, setCategory] =
        useState<(typeof QUESTION_CATEGORIES)[number]>("random");

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    });

    const suggestMessages = async () => {
        setIsSuggesting(true);
        try {
            const response = await axios.get("/api/suggest-messages", {
                params: {
                    category,
                },
            });
            if (response.data.success) {
                setSuggestions(response.data.suggestions);
                toast.success("Generated New Suggestions");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error("Failed to suggest messages", {
                    description: error.response?.data.message,
                });
            } else {
                console.error("Error in suggesting messages", error);
                toast.error("Failed to suggest messages");
            }
        } finally {
            setIsSuggesting(false);
        }
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSending(true);
        try {
            const response = await axios.post("/api/send-message", {
                content: data.content,
                shareToken: receivingUserShareToken,
            });

            const conversationToken = response.data.conversationToken;

            localStorage.setItem(
                `conv_${receivingUserShareToken}`,
                conversationToken,
            );

            toast.success("Message Sent Successfully");

            router.replace(`/c/${conversationToken}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error("Failed to send message", {
                    description: error.response?.data.message,
                });
            } else {
                console.error("Error in sending message", error);
                toast.error("Failed to send message");
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
    <div className="flex h-[85vh] w-full items-center justify-center gap-10 px-8">
        <Card className="flex h-[90%] w-full max-w-4xl flex-col items-center justify-between bg-gray-100 p-10 shadow-xl dark:bg-zinc-900 dark:border-zinc-800 lg:w-[45%]">
            <div className="h-1/4">
                <p className="text-3xl text-zinc-900 dark:text-zinc-100">
                    Send Your Message to
                </p>

                <h1 className="bg-linear-to-r from-black via-gray-500 to-black bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:via-zinc-300 dark:to-white">
                    {receivingUser}
                </h1>
            </div>

            <div className="h-3/4 w-full">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex h-full flex-col items-start justify-start space-y-6"
                >
                    <Controller
                        name="content"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="h-3/4"
                            >
                                <FieldLabel
                                    htmlFor="messageBox"
                                    className="text-2xl text-zinc-900 dark:text-zinc-100"
                                >
                                    Enter your message below
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    id="messageBox"
                                    className="h-[90%] w-full bg-amber-100 text-lg text-zinc-900 placeholder:text-zinc-500 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-50 dark:placeholder:text-amber-200/40"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="max 300 characters"
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Button type="submit" disabled={isSending}>
                        {isSending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Msg"
                        )}
                    </Button>
                </form>
            </div>
        </Card>

        {/* Suggest messages */}
        <div className="flex w-full max-w-sm flex-col gap-4">
            <div className="flex items-center gap-3">
                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(
                            e.target.value as (typeof QUESTION_CATEGORIES)[number],
                        )
                    }
                    disabled={isSuggesting || isSending}
                    className="h-10 cursor-pointer rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                    {QUESTION_CATEGORIES.map((categoryOption) => (
                        <option
                            key={categoryOption}
                            value={categoryOption}
                            className="dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            {categoryOption.charAt(0).toUpperCase() +
                                categoryOption.slice(1)}
                        </option>
                    ))}
                </select>

                <Button
                    type="button"
                    onClick={suggestMessages}
                    disabled={isSuggesting || isSending}
                    className="flex-1 cursor-pointer border transition-all duration-500 hover:-translate-y-1 hover:border-violet-400 hover:bg-linear-to-r hover:from-violet-500 hover:via-cyan-500 hover:to-blue-500 hover:shadow-lg"
                >
                    {isSuggesting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate
                        </>
                    )}
                </Button>
            </div>

            <Card className="space-y-3 bg-white p-4 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    AI Suggestions
                </h2>

                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() =>
                            form.setValue("content", suggestion, {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                        }
                        className="w-full cursor-pointer rounded-md border bg-white p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-muted hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    >
                        {suggestion}
                    </button>
                ))}
            </Card>
        </div>
    </div>
);
};

export default SendMessageForm;
