import type { ReactNode } from "react";

export const OpenLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-full">
      <div className="w-full flex items-center justify-center">{children}</div>
    </div>
  );
};
