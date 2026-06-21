"use client";

import { Card } from "@/components/ui/card";

const messages = [
    {
        type: "Funny",
        message: "Your music taste is a public safety concern.",
        caption: "Humor travels easier anonymously.",
        glow: "hover:shadow-[0_0_30px_rgba(250,204,21,0.15)]",
    },
    {
        type: "Encouraging",
        message: "You're doing better than you think.",
        caption: "Sometimes people mean it.",
        glow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    },
    {
        type: "Thoughtful",
        message:
            "What's something you've always wanted to do but never started?",
        caption: "Questions start conversations.",
        glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    },
    {
        type: "Deep",
        message:
            "You underestimate yourself more than you realize.",
        caption: "Honesty.",
        glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]",
    },
];

const FeatureSection = () => {
    return (
        <section className="relative overflow-hidden py-28">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/5 blur-3xl" />
                <div className="absolute right-0 top-1/2 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
                <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-6">
                {/* Hero Card */}
{/* Hero Card Container */}
<div className="relative mx-auto mb-16 max-w-5xl rounded-[2.5rem] p-px bg-linear-to-b from-black/8 via-black/2 to-transparent shadow-[0_30px_60px_-15px_rgba(109,40,217,0.12),0_10px_30px_-10px_rgba(0,0,0,0.04)]">
    
    {/* Soft, Unreal Ambient Glow (Gives the glass color depth over white) */}
    <div className="absolute inset-0 -z-10 bg-linear-to-tr from-violet-500/4 via-fuchsia-500/2 to-transparent blur-3xl rounded-[2.5rem]" />

    <Card className="relative h-full w-full rounded-[2.5rem] border-0 bg-white/45 backdrop-blur-3xl p-10 text-center sm:p-14 overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.02)]">
        
        {/* Darker Top Edge Reflection to cut through the white background */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-black/6 to-transparent" />
        
        {/* The Trapped Frosty Quote - Swapped to a high-contrast dark metallic gradient */}
        <blockquote className="relative bg-linear-to-b from-gray-900 via-violet-950 to-violet-800 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-[0_2px_8px_rgba(109,40,217,0.15)] sm:text-7xl">
            “When Honesty Has No Audience”
        </blockquote>

        {/* High-contrast subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-lg font-medium tracking-wide text-gray-600 sm:text-xl">
            The messages that stay with you are often the ones you
            <span className="text-violet-700 font-semibold"> never expected.</span>
        </p>

        {/* Subtle Bottom Light Catch */}
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-violet-500/6 blur-2xl pointer-events-none" />
    </Card>
</div>

                {/* Message Grid */}
                <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
                    {messages.map((msg) => (
                        <Card
                            key={msg.type}
                            className={`group rounded-3xl border bg-background/70 p-6 transition-all duration-500 hover:-translate-y-1 ${msg.glow}`}
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                    Anonymous Message
                                </p>

                                <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                                    {msg.type}
                                </span>
                            </div>

                            <p className="text-xl font-medium leading-relaxed">
                                {msg.message}
                            </p>

                            <p className="mt-4 text-xs text-muted-foreground opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100">
                                {msg.caption}
                            </p>
                        </Card>
                    ))}
                </div>

                {/* Closing Statement */}
                <div className="mx-auto mt-20 max-w-3xl text-center">
                    <p className="text-2xl font-medium leading-relaxed text-muted-foreground">
                        You never know what someone wants to say
                        <br />
                        until they don't have to say who they are.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;