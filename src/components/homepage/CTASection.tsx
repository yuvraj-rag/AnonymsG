"use client";

import { ArrowRight, Link2, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
    {
        icon: Link2,
        title: "Create",
        description: "Get your personal page instantly after account creation.",
    },
    {
        icon: Share2,
        title: "Share",
        description:
            "Send your link anywhere - Instagram, WhatsApp or Discord.",
    },
    {
        icon: Mail,
        title: "Receive",
        description:
            "People with link can send you messages. No account required.",
    },
];

const CTASection = () => {
    return (
        <section id="get-started" className="relative overflow-hidden pt-24">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/6 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
            </div>

            <div className="container mx-auto max-w-6xl px-6">
                {/* Heading */}
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.35em] text-violet-500">
                        Get Started
                    </p>

                    <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                        Ready to get your first
                        <span className="bg-linear-to-r from-foreground via-violet-500 to-foreground bg-clip-text text-transparent">
                            {" "}
                            anonymous{" "}
                        </span>
                        message?
                    </h2>
                    <Link href="/sign-up">
                        <Button
                            size="lg"
                            className="mt-18 h-12 rounded-full px-8 transition-all duration-300 hover:cursor-pointer hover:-translate-y-1 hover:shadow-xl"
                        >
                            Create Your Link
                            <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </Link>
                </div>

                {/* Steps */}
                <div className="mx-auto mt-24 max-w-5xl">
                    <div className="grid gap-10 md:grid-cols-3">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.title}
                                    className="relative flex flex-col items-center text-center"
                                >
                                    {/* Connector */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-[60%] top-7 hidden w-full items-center md:flex">
                                            <div className="h-px flex-1 bg-border" />
                                            <ArrowRight className="mx-2 size-4 text-violet-500" />
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border bg-background shadow-sm transition-all duration-300 hover:scale-105 hover:border-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                                        <Icon className="size-6 text-violet-500" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="mt-6 text-xl font-semibold">
                                        {step.title}
                                    </h3>

                                    <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 text-center">
                    <p className="text-sm tracking-wide text-muted-foreground">
                        Anonymous by design.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
