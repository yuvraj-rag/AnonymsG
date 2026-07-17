"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner"; //from shadcn
import { useRouter } from "next/navigation";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

const page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [username, setUsername] = useState("");

    const router = useRouter();

    //zod implementation
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        // no need to do any try catching. nextauth can handle it from here.
        // it needs a provider and few more arguments
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            switch (result.error) {
                case "USER_NOT_FOUND":
                    form.setError("identifier", {
                        type: "manual",
                        message: "Account does not exist",
                    });
                    break;

                case "INVALID_CREDENTIALS":
                    form.setError("root", {
                        type: "manual",
                        message: "Invalid credentials",
                    });
                    toast.error("Login Failed", {
                        description: "Invalid credentials",
                    });
                    break;

                default:
                    toast.error("Login Failed", {
                        description: result.error,
                    });
            }
        }

        if (result?.url) {
            router.replace("/dashboard");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] bg-gray-100 dark:bg-background">
            <div className="h-[60vh] w-full max-w-md mb-20 p-8 space-y-8 bg-white dark:bg-card rounded-lg shadow-md border dark:border-border">
                <div className="flex flex-col justify-evenly h-full text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-foreground">
                        Sign In
                    </h1>

                    <p className="text-2xl mb-6 text-foreground">
                        Lets start your journey
                    </p>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <Controller
                            name="identifier"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="identifierInput">
                                        Email or Username
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="identifierInput"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setUsername(e.target.value);
                                        }}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Email or username"
                                        autoComplete="username"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="passwordInput">
                                        Password
                                    </FieldLabel>

                                    <Input
                                        id="passwordInput"
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        type="password"
                                        placeholder="password"
                                        autoComplete="new-password"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {form.formState.errors.root && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                    Please Wait
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <p className="text-sm text-purple-500 dark:text-purple-400 mt-4">
                        New user?{" "}
                        <Link
                            href="/sign-up"
                            className="underline font-medium hover:text-purple-700 dark:hover:text-purple-300 transition"
                        >
                            Sign-Up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default page;
