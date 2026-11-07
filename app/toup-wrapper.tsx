"use client";

import TopUpDialog from "@/components/topup-dialog";
import { useAppStore } from "@/store/useAppStore";

export default function TopUpWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const topupDialogOpen = useAppStore((state) => state.topupDialogOpen);
  const setTopupDialogOpen = useAppStore((state) => state.setTopupDialogOpen);
  return (
    <>
      <TopUpDialog open={topupDialogOpen} onOpenChange={setTopupDialogOpen} />
      {children}
    </>
  );
}
