"use client";

import * as React from "react";
import { toast as sonnerToast, type ToastT } from "sonner";

// API simplifiée et typée
export const toast = {
  success: (message: string, options?: Partial<ToastT>) =>
    sonnerToast.success(message, options),

  error: (message: string, options?: Partial<ToastT>) =>
    sonnerToast.error(message, options),

  info: (message: string, options?: Partial<ToastT>) =>
    sonnerToast.info(message, options),

  warning: (message: string, options?: Partial<ToastT>) =>
    sonnerToast.warning(message, options),

  custom: (message: string, options?: Partial<ToastT>) =>
    sonnerToast(message, options),

  promise: sonnerToast.promise,

  dismiss: (id?: string) => sonnerToast.dismiss(id),
};

export function useToast() {
  const [isActive, setIsActive] = React.useState(false);

  // Hook simplifié si vous avez besoin de l'état
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    isActive,
  };
}
