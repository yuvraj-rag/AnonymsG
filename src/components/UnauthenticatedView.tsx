"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const UnauthenticatedView = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    return (
        <div className="flex min-h-[90vh] items-center justify-center bg-gray-100 transition-colors dark:bg-zinc-950">
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex justify-center">
            <LockKeyhole className="h-12 w-12 text-muted-foreground dark:text-zinc-400" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Authentication Required
        </h1>

        <p className="mt-3 text-muted-foreground dark:text-zinc-400">
            Please sign in to access this page and continue using
            AnonymsG.
        </p>

        <Button
            className="mt-6 w-full"
            disabled={isLoading}
            onClick={() => {
                setIsLoading(true);
                router.push("/sign-in");
            }}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting...
                </>
            ) : (
                "Sign In"
            )}
        </Button>
    </div>
</div>
    );
};

export default UnauthenticatedView;
