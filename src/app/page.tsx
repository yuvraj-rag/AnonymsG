"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, MessageCircleMore } from "lucide-react";
import FeatureSection from "@/components/homepage/FeatureSection";
import HeroSection from "@/components/homepage/HeroSection";
import CTASection from "@/components/homepage/CTASection";

const HomeDemo = dynamic(() => import("@/components/homepage/HomeDemo"), {
    ssr: false,
});

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <HomeDemo />
            <FeatureSection />
            <CTASection />
        </>
    );
}
