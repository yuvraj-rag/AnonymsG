'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';

const UnauthenticatedView = () => {
    return (
        <div className="flex items-center justify-center min-h-[90vh] bg-gray-100">
            <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                    <LockKeyhole className="h-12 w-12 text-muted-foreground" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Authentication Required
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Please sign in to access this page and continue using
                    AnonymsG.
                </p>

                <Link href="/sign-in">
                    <Button className="w-full mt-6">
                        Sign In
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default UnauthenticatedView;