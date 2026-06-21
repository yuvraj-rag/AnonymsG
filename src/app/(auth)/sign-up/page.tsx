'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { useDebounce } from "@uidotdev/usehooks";
import * as z from "zod"
import { useEffect, useState } from "react"
import { toast } from "sonner"; //from shadcn
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleX, Loader2 } from "lucide-react";

const page = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUsername = useDebounce(username, 500);
    const router = useRouter();

    //zod implementation
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {

            if (debouncedUsername.trim()) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    // Always encode URLs in cases of special characters
                    // const response = await axios.get(
                    //     `/api/check-unique-user?username=${encodeURIComponent(debouncedUsername)}`,
                    // );
                    //Better way : 
                    const response = await axios.get("/api/check-unique-user", {
                        params: {
                            username: debouncedUsername.trim()
                        }
                    })
                    // console.log("Axios response : ", response); // #INFO
                    setIsUsernameAvailable(true);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setIsUsernameAvailable(false);
                    setUsernameMessage(
                        axiosError.response?.data.message ??
                            "Error checking username",
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            } else {
                setIsUsernameAvailable(null);
                setUsernameMessage("");
            }
        };
        checkUsernameUnique();
    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/sign-up", data);
            toast.success("Success", { description: response.data.message});
            router.replace(`/verify/${username}`);
        } catch (error) {
            console.error("Error in signing up user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast.error("Sign up failed", { description: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[90vh] bg-gray-100">
            <div className="flex flex-col justify-between w-full max-w-md p-8 space-y-10 bg-white rounded-lg shadow-md">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl pb-10">
                        Join AnonymsG
                    </h1>
                    
                    <p className="pb-5 mb-5">
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <div className="text-center">
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="usernameInput">
                                        Username
                                    </FieldLabel>

                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="usernameInput"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setUsername(e.target.value);
                                            }}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter a unique username"
                                            autoComplete="username"
                                            className={`
                        pr-10
                        transition-all duration-200
                        ${
                            username
                                ? isUsernameAvailable
                                    ? "border-green-500 focus-visible:ring-green-500/30"
                                    : "border-red-500 focus-visible:ring-red-500/30"
                                : ""
                        }
                    `}
                                        />

                                        {isCheckingUsername && (
                                            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                                        )}

                                        {!isCheckingUsername &&
                                            usernameMessage && (
                                                <div
                                                    className={`absolute left-0 top-full mt-1 flex items-center gap-1 text-xs ${
                                                        isUsernameAvailable
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {isUsernameAvailable ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <CircleX className="h-3.5 w-3.5" />
                                                    )}

                                                    <span className="text-left">
                                                        {usernameMessage}
                                                    </span>
                                                </div>
                                            )}
                                    </div>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="emailInput">
                                        E-mail
                                    </FieldLabel>
                                    <Input
                                        id="emailInput"
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="E-mail"
                                        autoComplete="email"
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
                                        placeholder="Password"
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                    Please Wait
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default page