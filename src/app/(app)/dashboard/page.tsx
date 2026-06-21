"use client";

import MessageCard from "@/app/(app)/dashboard/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import UnauthenticatedView from "@/components/UnauthenticatedView";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [profileUrl, setProfileUrl] = useState(``);

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((msg) => String(msg._id) !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: false,
        },
    });

    //destructure important stuff from react-hook-form
    const { watch, setValue } = form;
    //these help in properly syncing UI side and backend side without issues
    //like instant toggle from UI and taking time for backend to register it

    const acceptMessages = watch("acceptMessages");

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>(
                "/api/accept-messages",
            );
            setValue("acceptMessages", response.data.isAcceptingMessages); //immediately sets value in UI
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Error", {
                description: axiosError.response?.data.message,
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchLink = useCallback(async () => {
    try {
        const response = await axios.get(
            "/api/share-token"
        );

        setProfileUrl(
            `${window.location.origin}/s/${response.data.shareToken}`
        );

    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        toast.error("Error", {
            description: axiosError.response?.data.message,
        });
    }
}, []);

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            setIsSwitchLoading(true);
            try {
                const response = await axios.get("/api/get-messages");
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast("Refreshed", {
                        description: "showing latest messages",
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error("Error", {
                    description: axiosError.response?.data.message,
                });
            } finally {
                setIsLoading(false);
                setIsSwitchLoading(false);
            }
        },
        [setIsLoading, setMessages],
    );

    const generateNewLink = async () => {
        setIsLoading(true);
        try {
            await axios.post("/api/share-token");
            await fetchLink();

            toast.success("New link generated")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Error", {
                description: axiosError.response?.data.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!session || !session.user) {
            return;
        }

        fetchMessages();
        fetchAcceptMessage();
        fetchLink();
    }, [session, fetchAcceptMessage, fetchMessages, fetchLink]);

    if (!session || !session.user) {
        //double check for unauthennticated users
        return <UnauthenticatedView />;
    }

    //handle switch change
    const handleSwitchChange = async (checked: boolean) => {
        try {
            console.log("handleSwitchChange sending ", checked);
            const response = await axios.post<ApiResponse>(
                "/api/accept-messages",
                {
                    acceptMessages: checked,
                },
            );
            setValue("acceptMessages", checked);
            const messageAcceptingStatus = checked ? "On" : "Off";
            if (response.data.success) {
                toast(
                    `Message accepting status set to ${messageAcceptingStatus} `,
                    { duration: 1000 },
                );
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Error", {
                description: axiosError.response?.data.message,
            });
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast("URL copied", {});
    };

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 w-full max-w-6xl space-y-6">
            <div>
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your anonymous inbox
                </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Your Anonymous Link
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Share this link to receive messages
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={generateNewLink}
                        disabled={isLoading}
                    >
                        Generate New Link
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="w-full rounded-md border bg-muted p-3 text-sm"
                    />

                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="rounded-xl border bg-card p-6 flex items-center justify-between">
                <div>
                    <h2 className="font-semibold">Accept Messages</h2>
                    <p className="text-sm text-muted-foreground">
                        Allow people to send anonymous messages
                    </p>
                </div>

                <Controller
                    name="acceptMessages"
                    control={form.control}
                    render={({ field }) => (
                        <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                                field.onChange(checked);
                                handleSwitchChange(checked);
                            }}
                            disabled={isSwitchLoading}
                        />
                    )}
                />
            </div>

            <Separator />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Messages</h2>

                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            fetchMessages(true);
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="h-4 w-4" />
                        )}
                        Refresh
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={String(message._id)}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <div className="rounded-xl border p-8 text-center text-muted-foreground">
                            No messages to display.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
