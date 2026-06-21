"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, User, Send, Loader2, Mail } from "lucide-react";

type DemoMessage = {
    id: string | number;
    content: string;
    isNew?: boolean;
};

const CATEGORY_MESSAGES = {
    Fun: "What's the funniest thing that happened to you recently?",
    Deep: "What's a lesson life taught you this year?",
    Creative: "If you could invent anything, what would it be?",
    Spicy: "What's an unpopular opinion you secretly have?",
    Random: "If animals could talk, which would be the rudest?",
} as const;

type CategoryMessages = typeof CATEGORY_MESSAGES;

const DEMO_USERS = [
    "alex_writes",
    "jordan",
    "sarahDev",
    "nightowl",
    "creative_mind",
    "Antman"
];

const FLY_DELAY = 900;
const FLY_HIDE = 800;
const BADGE_HIDE = 1800;
const INTERVAL_MS = 2000;

const HomeDemo = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] =
        useState<DemoMessage[]>([]);

    const [isSending, setIsSending] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [receiverGlow, setReceiverGlow] = useState(false);
    const [showIncomingBadge, setShowIncomingBadge] = useState(false);
    const [showFlyingMessage, setShowFlyingMessage] = useState(false);
    const [receiverIndex, setReceiverIndex] = useState(0);

    // Refs to store timer/interval IDs so we can clear them on unmount
    const intervalRef = useRef<number | null>(null);
    const timersRef = useRef<{ flying?: number; badge?: number; glow?: number }>({});

    useEffect(() => {
        const id = window.setInterval(() => {
            setReceiverIndex((prev) => (prev + 1) % DEMO_USERS.length);
        }, INTERVAL_MS);

        intervalRef.current = id;

        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            const t = timersRef.current;
            if (t.flying) window.clearTimeout(t.flying);
            if (t.badge) window.clearTimeout(t.badge);
            if (t.glow) window.clearTimeout(t.glow);
        };
    }, []);

    const receiverName = DEMO_USERS[receiverIndex];

    const handleSend = useCallback(async () => {
        if (!message.trim()) return;
        setIsSending(true);
        setShowFlyingMessage(false);

        requestAnimationFrame(() => {
            setShowFlyingMessage(true);
        });
        try {
            await new Promise((resolve) => setTimeout(resolve, FLY_DELAY));

            setReceiverGlow(true);
            setShowIncomingBadge(true);

            const newMessage: DemoMessage = {
                id: crypto.randomUUID(),
                content: message,
                isNew: true,
            };

            setMessages((prev) => [newMessage, ...prev].slice(0, 10));

            setMessage("");
            setShowSuggestions(true);

            // schedule clear timers and store their IDs so we can clear on unmount
            if (timersRef.current.flying)
                window.clearTimeout(timersRef.current.flying);
            timersRef.current.flying = window.setTimeout(
                () => setShowFlyingMessage(false),
                FLY_HIDE,
            );

            if (timersRef.current.badge)
                window.clearTimeout(timersRef.current.badge);
            timersRef.current.badge = window.setTimeout(
                () => setShowIncomingBadge(false),
                BADGE_HIDE,
            );

            if (timersRef.current.glow)
                window.clearTimeout(timersRef.current.glow);
            timersRef.current.glow = window.setTimeout(
                () => setReceiverGlow(false),
                BADGE_HIDE,
            );
        } finally {
            setIsSending(false);
        }
    }, [message]);


    return (
        <section
            id="demo"
            className="relative overflow-hidden py-24"
            role="region"
            aria-label="Live demo of anonymous messaging"
        >
            {/* Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-s-1/2 top-0 size-112 -translate-x-1/2 rounded-full bg-violet-500/8 blur-3xl" />

                <div className="absolute inset-e-0 top-1/3 size-80 rounded-full bg-violet-500/5 blur-3xl" />

                <div className="absolute inset-s-0 bottom-0 size-80 rounded-full bg-violet-500/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-5 py-2 text-sm font-medium backdrop-blur">
                        <Sparkles className="size-4 text-violet-500" />
                        Live Interactive Sandbox
                    </div>

                    <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                        Watch How
                        <span className="bg-linear-to-r from-foreground via-violet-500 to-foreground bg-clip-text text-transparent">
                            {" "}
                            Anonymous{" "}
                        </span>
                        Messages Are Sent
                    </h2>

                    <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                        Type a message on the left and watch it instantly appear
                        in the recipient's inbox.
                    </p>
                </div>

                {/* Sandbox */}
                <Card className="mx-auto max-w-6xl rounded-3xl border bg-background/70 p-4 backdrop-blur-xl md:p-6">
                    <div className="rounded-3xl border-2 border-dashed border-border/70 p-4 md:p-8">
                        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Sandbox
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Receiver shares the link with senders (can
                                    be multiple)
                                </p>
                            </div>

                            <div className="rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                                No Account Required
                            </div>
                        </div>

                        <div className="relative grid gap-8 lg:grid-cols-2">
                            {/* Animated Connector */}
                            <div className="pointer-events-none absolute inset-y-1/2 inset-s-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex items-center justify-center gap-2">
                                <div className="h-px w-10 bg-border" />
                                <ArrowRight className="size-4 text-violet-500" />
                                <div className="h-px w-10 bg-border" />
                            </div>

                            {/* Flying Message */}
                            {showFlyingMessage && (
                                <div className="pointer-events-none absolute inset-0 hidden lg:flex items-center justify-center">
                                    <div className="animate-[flyMessage_0.9s_ease-in-out_forwards] rounded-full border border-violet-500/30 bg-linear-to-r from-violet-500/20 via-violet-500/30 to-violet-500/20 p-3 shadow-[0_0_30px_rgba(139,92,246,0.35)] backdrop-blur">
                                        <Mail className="size-5 text-violet-500" />
                                    </div>
                                </div>
                            )}

                            {/* Sender Card */}
                            <SenderCard
                                message={message}
                                setMessage={setMessage}
                                isSending={isSending}
                                handleSend={handleSend}
                                showSuggestions={showSuggestions}
                                categoryMessages={CATEGORY_MESSAGES}
                            />

                            {/* Receiver Card */}
                            <ReceiverCard
                                receiverName={receiverName}
                                receiverGlow={receiverGlow}
                                showIncomingBadge={showIncomingBadge}
                                messages={messages}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
};

    function SenderCard({ message, setMessage, isSending, handleSend, showSuggestions, categoryMessages, }: {
        message: string;
        setMessage: (s: string) => void;
        isSending: boolean;
        handleSend: () => Promise<void> | void;
        showSuggestions: boolean;
            categoryMessages: CategoryMessages;
    }) {
        return (
            <div className="rounded-3xl border bg-background/60 p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3 border-b pb-4">
                    <div className="flex size-12 items-center justify-center rounded-full border">
                        <User className="size-5" />
                    </div>

                    <div>
                        <h4 className="font-semibold">You</h4>

                        <p className="text-sm text-muted-foreground">Anonymous Sender</p>
                    </div>
                </div>

                <Textarea
                    id="demo-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Type an anonymous message..."
                    className="min-h-40 resize-none"
                    maxLength={300}
                    aria-label="Type an anonymous message"
                    aria-describedby="demo-message-counter"
                />

                <div id="demo-message-counter" className="mt-2 text-right text-xs text-muted-foreground">
                    {message.length}/300
                </div>

                    <Button
                        onClick={handleSend}
                    disabled={isSending || !message.trim()}
                    className="mt-4 w-full cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                    aria-label="Send anonymously"
                >
                    {isSending ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 size-4" />
                            Send Anonymously
                        </>
                    )}
                </Button>

                {showSuggestions && (
                    <div className="mt-6 animate-in slide-in-from-bottom-2 fade-in duration-500">
                        <p className="mb-3 text-sm text-muted-foreground">Need inspiration?</p>

                        <div className="flex flex-wrap gap-2">
                            {Object.entries(categoryMessages).map(([category, value]) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setMessage(value)}
                                    className="cursor-pointer rounded-full border px-3 py-1 text-xs transition-all hover:bg-accent hover:shadow-sm"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    function ReceiverCard({ receiverName, receiverGlow, showIncomingBadge, messages, }: {
        receiverName: string;
        receiverGlow: boolean;
        showIncomingBadge: boolean;
        messages: { id: string | number; content: string; isNew?: boolean }[];
    }) {
        return (
            <div
                className={`rounded-3xl border bg-background/60 p-5 shadow-sm transition-all duration-700 ${
                    receiverGlow ? "border-violet-500/40 scale-[1.01]" : ""
                }`}
                role="region"
                aria-label="Receiver inbox preview"
            >
                <div className="mb-5 flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`relative flex size-12 items-center justify-center rounded-full border transition-all duration-700 ${receiverGlow ? "border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.35)]" : ""}`}
                        >
                            <Mail className="size-5" />
                        </div>

                        <div>
                            <h4 className="font-semibold">{receiverName}</h4>

                            <p className="text-sm text-muted-foreground">
                                Receiver
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="relative" aria-hidden={!receiverGlow}>
                            <div className="size-2 rounded-full bg-green-500" />

                            {receiverGlow && (
                                <div className="absolute inset-0 animate-ping rounded-full bg-green-500" />
                            )}
                        </div>
                        <span className="sr-only">Accepting messages</span>
                        <span aria-hidden>Accepting Messages</span>
                    </div>
                </div>

                {showIncomingBadge && (
                    <div className="mb-4 animate-in slide-in-from-top-2 fade-in duration-300">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-500">
                            ✨ New Message Received
                        </div>
                        <div className="sr-only" aria-live="polite">
                            New message received
                        </div>
                    </div>
                )}

                <div className="max-h-[420px] overflow-y-auto space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    {!messages.length && (
                        <p className="text-sm text-muted-foreground">
                            No messages yet.
                        </p>
                    )}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`rounded-2xl border bg-background/80 p-4 transition-all duration-700 ${msg.isNew ? "animate-in slide-in-from-top-3 fade-in shadow-[0_0_25px_rgba(139,92,246,0.18)]" : ""}`}
                        >
                            <div className="mb-2 border-b pb-2">
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Anonymous Message
                                </p>
                            </div>

                            <p className="leading-relaxed">{msg.content}</p>

                            <p className="mt-3 text-xs text-muted-foreground">
                                Just now
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    export default HomeDemo;