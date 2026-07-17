"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Send, Loader2, Mail, Lock } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types & Constants                                                  */
/* ------------------------------------------------------------------ */

type Message = {
    id: string;
    content: string;
    createdAt: number;
    isNew: boolean;
    hidden: boolean;
};

const CATEGORY_MESSAGES = {
    Fun: "What's the funniest thing that happened to you recently?",
    Deep: "What's a lesson life taught you this year?",
    Creative: "If you could invent anything, what would it be?",
    Spicy: "What's an unpopular opinion you secretly have?",
    Random: "If animals could talk, which would be the rudest?",
} as const;

const HIDDEN_MESSAGES = [
    "I've been thinking about you all day.",
    "You're really cute when you smile.",
    "If I told you, it wouldn't be anonymous.",
    "Let's keep this between us.",
    "You make my day better.",
    "I noticed you today.",
    "Wish I had the courage to say this in person.",
    "You're the reason I check my phone.",
];

const MAX_CHARS = 300;
const MAX_CLOUD_MESSAGES = 5;

const HIGHLIGHT_DURATION = 1000;
const GLOW_DURATION = 1000;
const USER_SEND_TRAVEL = 1200;
const CLOUD_DROP_TRAVEL = 1200;
const CLOUD_LOOP_MIN = 6000;
const CLOUD_LOOP_MAX = 9000;
const CLOUD_INITIAL_DELAY = 3000;
const CARD_HEIGHT = 480;
const TOP_STRIP_HEIGHT = 80;
const RELATIVE_TIME_TICK = 30000;

const generateId = () =>
    crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

const formatRelative = (now: number, createdAt: number) => {
    const seconds = Math.floor((now - createdAt) / 1000);
    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
};

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */

function useNow() {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), RELATIVE_TIME_TICK);
        return () => clearInterval(timer);
    }, []);

    return now;
}

/* ------------------------------------------------------------------ */
/* SenderCard                                                         */
/* ------------------------------------------------------------------ */

function SenderCard({
    message,
    setMessage,
    isSending,
    onSend,
    showSuggestions,
}: {
    message: string;
    setMessage: (value: string) => void;
    isSending: boolean;
    onSend: () => void;
    showSuggestions: boolean;
}) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div
            style={{ height: CARD_HEIGHT }}
            className="flex flex-col rounded-3xl border bg-background/60 p-5 shadow-sm"
        >
            <div className="mb-5 flex shrink-0 items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full border">
                        <User className="size-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold">You</h4>
                        <p className="text-sm text-muted-foreground">
                            Anonymous sender
                        </p>
                    </div>
                </div>

                <div className="rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                    No account required
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                <Textarea
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value.slice(0, MAX_CHARS))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Type an anonymous message..."
                    className="min-h-32 flex-1 resize-none"
                    maxLength={MAX_CHARS}
                />

                <div className="mt-2 text-right text-xs text-muted-foreground">
                    {message.length}/{MAX_CHARS}
                </div>

                <Button
                    onClick={onSend}
                    disabled={isSending || !message.trim()}
                    className="mt-4 w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                    {isSending ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 size-4" />
                            Send anonymously
                        </>
                    )}
                </Button>

                {showSuggestions && (
                    <div className="mt-6 overflow-y-auto">
                        <p className="mb-3 text-sm text-muted-foreground">
                            Need inspiration?
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(CATEGORY_MESSAGES).map(
                                ([category, value]) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => setMessage(value)}
                                        className="rounded-full border px-3 py-1 text-xs transition-colors hover:bg-accent"
                                    >
                                        {category}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* CloudSenders                                                       */
/* ------------------------------------------------------------------ */

function CloudSenders({ activeSender }: { activeSender: number | null }) {
    const positions = ["translate-y-1", "-translate-y-3", "translate-y-1"];

    return (
        <div className="relative z-20 flex h-full w-full items-end justify-center gap-6 overflow-visible">
            {positions.map((position, index) => {
                const isActive = activeSender === index;

                return (
                    <div
                        key={index}
                        className={`relative flex flex-col items-center transition-all duration-500 ${position}`}
                    >
                        <div
                            className={`flex size-10 items-center justify-center rounded-full border bg-background shadow-sm transition-all duration-300 ${
                                isActive
                                    ? "scale-110 border-violet-500 ring-2 ring-violet-500/40"
                                    : ""
                            }`}
                        >
                            <User className="size-4" />
                        </div>

                        {isActive && (
                            <div className="absolute top-full left-1/2 z-30 -translate-x-1/2 animate-[cloudDrop_1.2s_ease-in_forwards]">
                                <FloatingMailOrb />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function FloatingMailOrb() {
    return (
        <div className="flex size-9 items-center justify-center rounded-full bg-violet-500 shadow-[0_0_20px_6px_rgba(139,92,246,0.45)]">
            <Mail className="size-4 text-white" />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* ReceiverPanel                                                      */
/* ------------------------------------------------------------------ */

function ReceiverPanel({
    messages,
    glow,
    showBadge,
    now,
    listRef,
    mobile = false,
}: {
    messages: Message[];
    glow: boolean;
    showBadge: boolean;
    now: number;
    listRef: React.RefObject<HTMLDivElement | null>;
    mobile?: boolean;
}) {
    return (
        <div
            style={mobile ? { minHeight: 320 } : { height: CARD_HEIGHT }}
            className={`flex flex-col rounded-3xl border bg-background/60 p-5 shadow-sm transition-all duration-500 ${
                glow ? "scale-[1.01] border-violet-500/40" : ""
            }`}
        >
            <div className="mb-4 flex shrink-0 items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex size-12 items-center justify-center rounded-full border transition-all duration-500 ${
                            glow
                                ? "border-violet-500 shadow-[0_0_25px_rgba(139,92,246,0.35)]"
                                : ""
                        }`}
                    >
                        <Mail className="size-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold">Someone</h4>
                        <p className="text-sm text-muted-foreground">
                            Receiver
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="relative">
                        <div className="size-2 rounded-full bg-green-500" />
                        {glow && (
                            <div className="absolute inset-0 animate-ping rounded-full bg-green-500" />
                        )}
                    </div>
                    Accepting
                </div>
            </div>

            <div className="mb-4 h-6 shrink-0">
                {showBadge && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-500">
                            New message received
                        </div>
                    </div>
                )}
            </div>

            <div
                ref={listRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1"
            >
                {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No messages yet.
                    </p>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`rounded-2xl border bg-background/80 p-4 transition-all duration-500 ${
                            msg.isNew
                                ? "animate-in fade-in slide-in-from-top-3 shadow-[0_0_25px_rgba(139,92,246,0.18)]"
                                : ""
                        } ${!msg.hidden ? "border-l-2 border-l-violet-500/50" : ""}`}
                    >
                        <div className="mb-2 flex items-center justify-between border-b pb-2">
                            <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {msg.hidden ? (
                                    <>
                                        <Lock className="size-3" />
                                        Anonymous
                                    </>
                                ) : (
                                    "You sent"
                                )}
                            </p>
                            <span className="text-[10px] text-muted-foreground">
                                {formatRelative(now, msg.createdAt)}
                            </span>
                        </div>

                        <p
                            className={
                                msg.hidden ? "select-none blur-sm" : ""
                            }
                        >
                            {msg.content}
                        </p>

                        {msg.hidden && (
                            <p className="mt-2 text-xs text-muted-foreground">
                                From another sender
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* HomeDemo                                                            */
/* ------------------------------------------------------------------ */

const HomeDemo = () => {
    const now = useNow();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [glow, setGlow] = useState(false);
    const [showBadge, setShowBadge] = useState(false);
    const [flyingMessage, setFlyingMessage] = useState(false);
    const [activeCloudSender, setActiveCloudSender] = useState<number | null>(
        null,
    );

    const hasStartedCloudLoop = useRef(false);
    const cloudTimer = useRef<number | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const cloudMessageCount = useRef(0);

    const flashReceiver = () => {
        setGlow(true);
        setShowBadge(true);

        window.setTimeout(() => {
            setGlow(false);
            setShowBadge(false);
        }, GLOW_DURATION);
    };

    const clearHighlight = (id: string) => {
        window.setTimeout(() => {
            setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, isNew: false } : m)),
            );
        }, HIGHLIGHT_DURATION);
    };

    const spawnCloudMessage = () => {
        if (cloudMessageCount.current >= MAX_CLOUD_MESSAGES) return;

        const sender = Math.floor(Math.random() * 3);
        setActiveCloudSender(sender);

        window.setTimeout(() => {
            const id = generateId();
            cloudMessageCount.current += 1;

            setMessages((prev) => [
                {
                    id,
                    content:
                        HIDDEN_MESSAGES[
                            Math.floor(Math.random() * HIDDEN_MESSAGES.length)
                        ],
                    createdAt: Date.now(),
                    hidden: true,
                    isNew: true,
                },
                ...prev,
            ]);

            flashReceiver();
            clearHighlight(id);
            setActiveCloudSender(null);
        }, CLOUD_DROP_TRAVEL);
    };

    const startCloudLoop = () => {
        if (hasStartedCloudLoop.current) return;
        hasStartedCloudLoop.current = true;

        const loop = () => {
            if (cloudMessageCount.current < MAX_CLOUD_MESSAGES) {
                spawnCloudMessage();
                const delay =
                    CLOUD_LOOP_MIN +
                    Math.random() * (CLOUD_LOOP_MAX - CLOUD_LOOP_MIN);
                cloudTimer.current = window.setTimeout(loop, delay);
            }
        };

        cloudTimer.current = window.setTimeout(loop, CLOUD_INITIAL_DELAY);
    };

    const handleSend = () => {
        if (!message.trim() || isSending) return;

        setIsSending(true);
        setFlyingMessage(true);

        window.setTimeout(() => {
            const id = generateId();

            setMessages((prev) => [
                {
                    id,
                    content: message,
                    createdAt: Date.now(),
                    hidden: false,
                    isNew: true,
                },
                ...prev,
            ]);

            flashReceiver();
            clearHighlight(id);

            setMessage("");
            setShowSuggestions(true);
            setFlyingMessage(false);
            setIsSending(false);

            startCloudLoop();
        }, USER_SEND_TRAVEL);
    };

    useEffect(() => {
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [messages.length]);

    useEffect(() => {
        return () => {
            if (cloudTimer.current) clearTimeout(cloudTimer.current);
        };
    }, []);

    return (
        <section id="demo" className="relative overflow-hidden my-18">
            <div className="container mx-auto px-6">
                <div className="mx-auto mb-14 text-center">
                    <h2 className="text-4xl font-black">
                        Watch how
                        <span className="text-violet-500"> anonymous </span>
                        messages are sent
                    </h2>
                </div>

                <Card className="mx-auto max-w-6xl overflow-visible rounded-3xl p-4 backdrop-blur-xl">
                    {/* ── DESKTOP layout (lg+) ── */}
                    <div className="hidden lg:block">
                        {/* Row 1: full-width top strip */}
                        <div
                            style={{ height: TOP_STRIP_HEIGHT }}
                            className="grid grid-cols-2 gap-8 overflow-visible"
                        >
                            <div className="flex items-center px-1">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                        Demo
                                    </p>
                                    <h3 className="text-xl font-bold">
                                        Try it yourself
                                    </h3>
                                </div>
                            </div>

                            <div className="overflow-visible">
                                <CloudSenders
                                    activeSender={activeCloudSender}
                                />
                            </div>
                        </div>

                        {/* Row 2: two equal cards */}
                        <div className="relative grid grid-cols-2 gap-8">
                            {flyingMessage && (
                                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                                    <div className="animate-[flyMessage_1.2s_ease-in-out]">
                                        <FloatingMailOrb />
                                    </div>
                                </div>
                            )}

                            <SenderCard
                                message={message}
                                setMessage={setMessage}
                                isSending={isSending}
                                onSend={handleSend}
                                showSuggestions={showSuggestions}
                            />

                            <ReceiverPanel
                                messages={messages}
                                glow={glow}
                                showBadge={showBadge}
                                now={now}
                                listRef={listRef}
                            />
                        </div>
                    </div>

                    {/* ── MOBILE layout (below lg) ── */}
                    <div className="flex flex-col gap-4 lg:hidden">
                        {/* Cloud senders centered above receiver */}
                        <div className="overflow-visible">
                            <CloudSenders activeSender={activeCloudSender} />
                        </div>

                        {/* Receiver card */}
                        <ReceiverPanel
                            messages={messages}
                            glow={glow}
                            showBadge={showBadge}
                            now={now}
                            listRef={listRef}
                            mobile
                        />

                        {/* Flying message travels upward on mobile */}
                        <div className="relative">
                            {flyingMessage && (
                                <div className="pointer-events-none absolute inset-x-0 -top-4 z-20 flex justify-center">
                                    <div className="animate-[flyMessageUp_1.2s_ease-in-out]">
                                        <FloatingMailOrb />
                                    </div>
                                </div>
                            )}

                            <SenderCard
                                message={message}
                                setMessage={setMessage}
                                isSending={isSending}
                                onSend={handleSend}
                                showSuggestions={showSuggestions}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            <style jsx>{`
                @keyframes flyMessage {
                    from {
                        opacity: 0;
                        transform: translateX(-120px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(120px);
                    }
                }
                @keyframes flyMessageUp {
                    from {
                        opacity: 0;
                        transform: translateY(0px);
                    }
                    40% {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-120px);
                    }
                }
                @keyframes cloudDrop {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    20% {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                        transform: translateY(60px);
                    }
                }
            `}</style>
        </section>
    );
};

export default HomeDemo;
