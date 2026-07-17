import {z} from "zod"

export const messageSchema = z.object({
    content: z
    .string()
    .min(1, {message: 'Message cannot be empty'})
    .max(300, {message: 'Message content must be no longer than 300 characters'})
})