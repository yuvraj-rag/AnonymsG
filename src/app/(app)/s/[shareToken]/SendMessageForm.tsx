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

const DEFAULT_SUGGESTIONS = [
    "What's a small thing that instantly improves your day?",
    "If you could master any skill overnight, what would it be?",
    "What's something most people should try at least once?"
];

const QUESTION_CATEGORIES = [
    "random",
    "fun",
    "creative",
    "deep",
    "spicy",
] as const;


const SendMessageForm = ({ username, shareToken }: { username: string, shareToken: string }) => {
    const receivingUser = username;
    const receivingUserShareToken = shareToken;
    const [isSending, setIsSending] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [category, setCategory] = useState<(typeof QUESTION_CATEGORIES)[number]>("random");

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
                    category
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
            await axios.post("/api/send-message", {
                content: data.content,
                shareToken: receivingUserShareToken,
            });
            toast.success("Message Sent Successfully");
            form.reset({
                content: "",
            });
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
    <div className="flex items-center justify-center gap-10 h-[85vh] w-full px-8">
        <Card className="flex flex-col items-center justify-between p-10 h-[90%] w-full max-w-4xl lg:w-[45%] bg-gray-100 shadow-xl">
            <div className="h-1/4">
                <p className="text-3xl">Send Your Message to</p>
                <h1 className="text-5xl font-bold bg-linear-to-r from-black via-gray-500 to-black bg-clip-text text-transparent">
                    {receivingUser}
                </h1>
            </div>

            <div className="h-3/4 w-full">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col items-start justify-start h-full space-y-6"
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
                                    className="text-2xl"
                                >
                                    Enter your message below
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    id="messageBox"
                                    className="bg-amber-100 w-full h-[90%] text-lg"
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
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex gap-3 items-center">
                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(
                            e.target.value as (typeof QUESTION_CATEGORIES)[number]
                        )
                    }
                    disabled={isSuggesting || isSending}
                    className="h-10 rounded-md border bg-background px-3 text-sm font-medium cursor-pointer transition-colors hover:bg-accent focus:outline-none"
                >
                    {QUESTION_CATEGORIES.map((categoryOption) => (
                        <option
                            key={categoryOption}
                            value={categoryOption}
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
                    className="flex-1 cursor-pointer border transition-all duration-500 hover:border-violet-400 hover:shadow-lg hover:-translate-y-1 hover:bg-linear-to-r hover:from-violet-500 hover:via-cyan-500 hover:to-blue-500"
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

            <Card className="p-4 space-y-3 shadow-md">
                <h2 className="font-semibold text-lg">
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
                        className="w-full rounded-md border p-3 text-left cursor-pointer transition-all duration-300 hover:bg-muted hover:shadow-md hover:-translate-y-1"
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
