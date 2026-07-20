import { useValidationMessages } from "@/providers/ValidationMessagesContext";
import { z } from "zod";
import { createValidationRules } from "./common-rules";

export const RegisterSchema = (isMobile: boolean) => {
    const messages = useValidationMessages();
    const { validateNewPassword, validateConfirmPassword } = createValidationRules(messages);

    return z.object({
        username: isMobile ? z.string().min(1, messages.phoneNumberIsRequired) : z.string().email({ message: messages.invalidEmail }),
        password: validateNewPassword,
        confirmpassword: validateConfirmPassword("password"),
    });
};

// generate form types from zod validation schema
export type RegisterSchemaType = z.infer<ReturnType<typeof RegisterSchema>>;
