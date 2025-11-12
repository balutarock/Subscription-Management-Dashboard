import type { ReactNode } from "react";

export const HeadingText = ({ children }: { children: ReactNode }) => {
  return <p className="text-[32px] font-medium">{children}</p>;
};

export const OpacText = ({ children }: { children: ReactNode }) => {
  return <p className="text-lg/[25.2px] font-[400]  opacity-60">{children}</p>;
};

export const BoldText = ({ children }: { children: ReactNode }) => {
  return <p className="text-lg/[19.6px] font-[500]">{children}</p>;
};

export const ParaText = ({ children }: { children: ReactNode }) => {
  return <p className="text-md/[17.6px] font-[400]">{children}</p>;
};

export const ParaOpacText = ({ children }: { children: ReactNode }) => {
  return <p className="text-md/[17.6px] font-[400] opacity-60">{children}</p>;
};

export const H3 = ({ children }: { children: ReactNode }) => {
  return <p className="text-2xl font-medium">{children}</p>;
};
