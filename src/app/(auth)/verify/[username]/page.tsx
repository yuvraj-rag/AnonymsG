"use client";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();

    //zod implementation
    const form = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post("/api/verify-code", {
                username: params.username,
                code: data.code,
            });
            toast.success("Success", { description: response.data.message });
            router.replace("/sign-in");
        } catch (error) {
            console.error("Error in verifying of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Signup Failed", {
                description: axiosError.response?.data.message,
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-950">
            <div className="mb-40 w-full max-w-md space-y-8 rounded-lg border border-zinc-200 bg-white p-8 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-center">
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-5xl">
                        Verify your account
                    </h1>

                    <p className="mb-4 text-zinc-700 dark:text-zinc-300">
                        Enter verification code sent to your email <br />
                        (The code may end up in spam folder in some cases)
                    </p>
                </div>

                <div>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor="verifyCodeInput"
                                        className="text-zinc-900 dark:text-zinc-100"
                                    >
                                        Verification Code
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="verifyCodeInput"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Code"
                                        className="dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                    />
                                </Field>
                            )}
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyAccount;
