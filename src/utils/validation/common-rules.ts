import { z } from 'zod';

export const fileSchema = z.object({
  name: z.string(),
  url: z.string(),
  size: z.number(),
});

export type FileSchema = z.infer<typeof fileSchema>;

export const createValidationRules = (messages: {
  emailIsRequired: string;
  invalidEmail: string;
  phoneNumberIsRequired: string;
  invalidPhoneNumber: string;
  passwordLengthMin: string;
  passwordRequired: string;
  passwordOneUppercase: string;
  passwordOneLowercase: string;
  passwordOneNumeric: string;
  passwordsMustMatch: string;
}) => {
  const validateEmail = z.string().min(1, { message: messages.emailIsRequired }).email({ message: messages.invalidEmail });

  const validatePhoneNumber = z
    .string()
    .min(1, { message: messages.phoneNumberIsRequired })
    .regex(/^\+?[0-9]\d{6,14}$/, { message: messages.invalidPhoneNumber });

  const validateUsername = z.string().superRefine((value, context) => {
    if (typeof value !== 'string') {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid input type.',
      });
      return;
    }
    if (/^[a-zA-Z]/.test(value)) {
      if (!validateEmail.safeParse(value).success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.invalidEmail,
        });
      }
    } else if (/^\+?[0-9]/.test(value)) {
      if (!validatePhoneNumber.safeParse(value).success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.invalidPhoneNumber,
        });
      }
    } else {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter Email or PhoneNumber',
      });
    }
  });

  const validatePassword = z.string().min(4, { message: messages.passwordLengthMin });

  const validateNewPassword = z
    .string()
    .min(1, { message: messages.passwordRequired })
    .min(6, { message: messages.passwordLengthMin })
    .regex(new RegExp('.*[A-Z].*'), {
      message: messages.passwordOneUppercase,
    })
    .regex(new RegExp('.*[a-z].*'), {
      message: messages.passwordOneLowercase,
    })
    .regex(new RegExp('.*\\d.*'), { message: messages.passwordOneNumeric });

  const validateConfirmPassword = (fieldToMatch: string) =>
    z
      .string()
      .min(1, { message: messages.passwordRequired })
      .superRefine((val, ctx) => {
        // @ts-expect-error: ctx.parent is available at runtime
        if (ctx.parent && val !== ctx.parent[fieldToMatch]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.passwordsMustMatch,
          });
        }
      });

  return {
    validateEmail,
    validatePhoneNumber,
    validateUsername,
    validatePassword,
    validateNewPassword,
    validateConfirmPassword,
  };
};
