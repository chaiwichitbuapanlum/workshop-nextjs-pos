import { useEffect, useActionState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ActionType, initialFormState } from "@/types/action-type";
import { toast } from "sonner";

export const useForm = (action: ActionType, route?: string) => {
  const [state, formAction, isPending] = useActionState(
    action,
    initialFormState,
  );
  const router = useRouter();

  useEffect(() => {
    if (!state) return;

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

  // แสดง error จาก server ถ้ามี
  const errors = useMemo(() => state?.errors ?? {}, [state?.errors]);
  // placeholder สำหรับ compatibility เผื่อถูกใช้งานใน component อื่น
  const clearErrors = useCallback(() => {}, []);

  return {
    state,
    errors,
    formAction,
    isPending,
    clearErrors,
  };
};
