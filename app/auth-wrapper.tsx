"use client";

import AuthDialog from "@/components/auth-dialog";
import RegisterDialog from "@/components/register-dialog";
import { useSessionStore } from "@/store/useSessionStore";
import { useEffect } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const authDialogState = useSessionStore((state) => state.authDialogState);
  const setAuthDialogState = useSessionStore(
    (state) => state.setAuthDialogState
  );
  const authDialogType = useSessionStore((state) => state.authDialogType);

  const fetchUser = useSessionStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <AuthDialog
        open={authDialogState && authDialogType === "login"}
        onOpenChange={setAuthDialogState}
      />
      <RegisterDialog
        open={authDialogState && authDialogType === "register"}
        onOpenChange={setAuthDialogState}
      />
      {children}
    </>
  );
}
