import { z } from "zod";

import { useValidationMessages } from "../../../providers/ValidationMessagesContext";
import { createValidationRules } from "../common-rules";

export const ResetPasswordSchema = () => {
    const messages = useValidationMessages();
    const { validatePassword, validateConfirmPassword } = createValidationRules(messages);

    return z.object({
        newPassword: validatePassword,
        confirmpassword: validateConfirmPassword("newPassword"),
    });
};

// generate form types from zod validation schema
export type ResetPasswordSchemaType = z.infer<ReturnType<typeof ResetPasswordSchema>>;
