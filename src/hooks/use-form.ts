import { useState, useEffect, useActionState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ActionType, initialFormState } from "@/types/action-type";
import { toast } from "sonner";

export const useForm = (action: ActionType, route?: string) => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [state, formAction, isPending] = useActionState(
    action,
    initialFormState,
  );
  const router = useRouter();

  useEffect(() => {
    if (!state) return;

    // console.log('useForm state:', state); // Debug log

    if (state.errors) setErrors(state.errors);

    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        if (route) {
          console.log('Redirecting to:', route); // Debug log
          router.push(route);
        }
      } else {
        toast.error(state.message);
      }
    }
  }, [state, route, router]);

  const clearErrors = useCallback(() => setErrors({}), []);

  return {
    state,
    errors,
    formAction,
    isPending,
    clearErrors,
  };
};
