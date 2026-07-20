import { useValidationMessages } from "@/providers/ValidationMessagesContext";
import { z } from "zod";

/**
 * Generates a Zod schema for password reset form validation.
 * @param isMobile - Whether the username is a phone number.
 * @returns A Zod schema for password reset form validation.
 */
export const ForgetPasswordSchema = (isMobile: boolean) => {
    const messages = useValidationMessages();
    return z.object({
        username: isMobile ? z.string().min(1, messages.phoneNumberIsRequired) : z.string().email({ message: messages.invalidEmail }),
    });
};

// generate form types from zod validation schema
export type ForgetPasswordSchemaType = z.infer<ReturnType<typeof ForgetPasswordSchema>>;
