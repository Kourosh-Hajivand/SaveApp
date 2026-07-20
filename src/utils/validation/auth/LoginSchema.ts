import { useValidationMessages } from "@/providers/ValidationMessagesContext";
import { z } from "zod";

export const LoginSchema = (isMobile: boolean) => {
    const messages = useValidationMessages();
    return z.object({
        username: isMobile ? z.string().min(1, messages.phoneNumberIsRequired) : z.string().email({ message: messages.invalidEmail }),
        password: z.string().min(1, { message: messages.passwordRequired }),
    });
};

// generate form types from zod validation schema
export type LoginSchemaType = z.infer<ReturnType<typeof LoginSchema>>;
