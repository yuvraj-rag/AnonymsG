"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { Moon, Sun, MessageCircleMore } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user;

    const pathName = usePathname();
    const isHomePage = pathName === "/";

    const { theme, setTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="group flex items-center gap-3 transition-all duration-300"
                >
                    <div className="relative flex size-10 items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-xl">

                        <Image
                            src="../icon.svg" // or /icon.svg
                            alt="AnonymsG Logo"
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-110"
                            priority
                        />
                    </div>

                    <div className="flex items-wbaseline">
                        <span className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                            Anonyms
                        </span>

                        <span className="bg-linear-to-r from-foreground via-violet-500 to-foreground bg-clip-text text-2xl font-black tracking-tight text-transparent">
                            G
                        </span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {session ? (
                        <></>
                    ) : (
                        <>
                            <Link
                                href="/#home"
                                className="transition-colors hover:text-violet-500"
                            >
                                Home
                            </Link>

                            {isHomePage && (
                                <>
                                    <a
                                        href="#demo"
                                        className="transition-colors hover:text-violet-500"
                                    >
                                        Demo
                                    </a>

                                    <a
                                        href="#get-started"
                                        className="transition-colors hover:text-violet-500"
                                    >
                                        Get Started
                                    </a>
                                </>
                            )}
                        </>
                    )}
                </div>
                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                    >
                        {mounted &&
                            (theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            ))}
                    </Button>

                    {session ? (
                        <>
                            <span className="hidden lg:block text-sm text-muted-foreground">
                                {user?.username || user?.email}
                            </span>

                            <Button
                                variant="outline"
                                onClick={() =>
                                    signOut({
                                        callbackUrl: "/sign-in",
                                    })
                                }
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button>Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
