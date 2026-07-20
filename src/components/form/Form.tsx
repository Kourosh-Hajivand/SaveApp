import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useImperativeHandle, type Ref } from "react";
import {
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import type { ZodTypeAny } from "zod";

export type FormHandle = {
  submitForm: () => void;
};

type FormProps<TFieldValues extends FieldValues = FieldValues> = {
  onSubmit: SubmitHandler<TFieldValues>;
  children: (methods: UseFormReturn<TFieldValues>) => React.ReactNode;
  useFormProps?: UseFormProps<TFieldValues>;
  validationSchema?: ZodTypeAny;
  initialValues?: DefaultValues<TFieldValues> | null;
  resetValues?: DefaultValues<TFieldValues> | null;
  className?: string;
  reference?: Ref<FormHandle>;
  scrollable?: boolean;
};

export function Form<TFieldValues extends FieldValues = FieldValues>({
  onSubmit,
  children,
  useFormProps,
  validationSchema,
  initialValues,
  resetValues,
  reference,
  className,
  scrollable = true,
}: FormProps<TFieldValues>) {
  const methods = useForm<TFieldValues>({
    ...useFormProps,
    resolver: validationSchema
      ? (zodResolver(
          validationSchema as never,
        ) as UseFormProps<TFieldValues>["resolver"])
      : useFormProps?.resolver,
    shouldUnregister: false,
  });

  useEffect(() => {
    if (initialValues) {
      methods.reset(initialValues);
    }
  }, [initialValues, methods]);

  useEffect(() => {
    if (resetValues) {
      methods.reset(resetValues);
    }
  }, [resetValues, methods]);

  useImperativeHandle(reference, () => ({
    submitForm() {
      void methods.handleSubmit(onSubmit)();
    },
  }));

  const content = <View>{children(methods)}</View>;

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      {scrollable ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className={className ?? "flex-1"}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {content}
        </ScrollView>
      ) : (
        <View className={className ?? "flex-1"}>{content}</View>
      )}
    </KeyboardAvoidingView>
  );
}
