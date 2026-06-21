'use client'

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, MessageCircleMore } from "lucide-react";
import FeatureSection from "@/components/homepage/FeatureSection";

const HomeDemo = dynamic(() => import("@/components/homepage/HomeDemo"), { ssr: false });


export default function HomePage() {
  return (
    <>
<section className="relative overflow-hidden">
    {/* Background Effects */}
    <div className="absolute inset-0 -z-10 overflow-hidden">

        {/* Grid Pattern */}
        <div
            className="
                absolute inset-0
                bg-[linear-gradient(to_right,rgba(128,128,128,0.08)_1px,transparent_1px),
                linear-gradient(to_bottom,rgba(128,128,128,0.08)_1px,transparent_1px)]
                bg-size-[48px_48px]
                dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),
                linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
            "
        />

        {/* Main Glow */}
        <div className="absolute inset-s-1/2 top-1/3 size-160 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />

        {/* Secondary Glow */}
        <div className="absolute inset-e-0 top-20 size-72 rounded-full bg-indigo-500/5 blur-[100px]" />
    </div>

    <div className="container mx-auto px-6 pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* LEFT CONTENT */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-start">

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur">
                    <MessageCircleMore className="size-4 text-violet-500" />
                    Anonymous Conversations Made Simple
                </div>

                <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                    Say What Matters{" "}
                    <span className="bg-linear-to-r from-foreground via-violet-500 to-foreground bg-clip-text text-transparent">
                        Anonymously
                    </span> 
                    <br />
                    No Pressure
                </h1>

                <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                    Create your profile, and receive anonymous messages from anyone who you share it with. 
                    <br /> Or be the one sending those messages.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">

                    <Link href="/sign-up">
                        <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                            Create Profile
                            <ArrowRight className="size-4" />
                        </button>
                    </Link>

                    <a href="#demo">
                        <button className="cursor-pointer rounded-lg border px-6 py-3 font-medium transition-all duration-300 hover:bg-accent hover:shadow-md">
                            See How It Works
                        </button>
                    </a>

                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="relative flex flex-col gap-4">

                {/* Glow Behind Cards */}
                <div className="absolute inset-0 -z-10 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="animate-[float_8s_ease-in-out_infinite] rounded-2xl border bg-background/80 p-5 shadow-xl backdrop-blur transition-all duration-300 hover:border-violet-500/30">
                    <p className="mb-2 text-sm text-muted-foreground">
                        Anonymous Message
                    </p>
                    <p>
                        What's something people often misunderstand about you?
                    </p>
                </div>

                <div className="ms-auto animate-[float_10s_ease-in-out_infinite] rounded-2xl border bg-background/80 p-5 shadow-xl backdrop-blur transition-all duration-300 hover:border-violet-500/30">
                    <p className="mb-2 text-sm text-muted-foreground">
                        Anonymous Message
                    </p>
                    <p>
                        What goal are you currently working towards?
                    </p>
                </div>

                <div className="animate-[float_12s_ease-in-out_infinite] rounded-2xl border bg-background/80 p-5 shadow-xl backdrop-blur transition-all duration-300 hover:border-violet-500/30">
                    <p className="mb-2 text-sm text-muted-foreground">
                        Anonymous Message
                    </p>
                    <p>
                        You seem like a great friend. What's your secret?
                    </p>
                </div>

                <div className="ms-auto animate-[float_9s_ease-in-out_infinite] rounded-2xl border bg-background/80 p-5 shadow-xl backdrop-blur transition-all duration-300 hover:border-violet-500/30">
                    <p className="mb-2 text-sm text-muted-foreground">
                        Anonymous Message
                    </p>
                    <p>
                        If you could instantly learn one skill, what would it be?
                    </p>
                </div>

            </div>
        </div>
    </div>
</section>
<HomeDemo/>
<FeatureSection/>
</>
  );
}