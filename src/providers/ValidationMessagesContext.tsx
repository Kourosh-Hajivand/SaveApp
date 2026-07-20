import React, { createContext, useContext } from "react";
import {
  validationMessages,
  type ValidationMessages,
} from "@/utils/validation/messages";

const ValidationMessagesContext =
  createContext<ValidationMessages>(validationMessages);

export function ValidationMessagesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ValidationMessagesContext.Provider value={validationMessages}>
      {children}
    </ValidationMessagesContext.Provider>
  );
}

export function useValidationMessages(): ValidationMessages {
  return useContext(ValidationMessagesContext);
}
