'use client'
import { useParams, useRouter } from 'next/navigation'
import {toast} from 'sonner'
import * as z from "zod"
import { Controller, useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();

    //zod implementation
    const form = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })
            toast.success("Success", { description: response.data.message });
            router.replace('/sign-in')

        } catch (error) {
            console.error("Error in verifying of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Signup Failed", {description: axiosError.response?.data.message })
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 mb-40 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify your account
                    </h1>
                    <p className="mb-4">
                        Enter verification code sent to your email
                    </p>
                </div>
                <div>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="verifyCodeInput">
                                        Verification Code
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="verifyCodeInput"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Code"
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

export default VerifyAccount