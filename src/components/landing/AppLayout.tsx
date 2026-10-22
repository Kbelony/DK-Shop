import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

// 24px side margins, like the reference. Sections own their vertical spacing.
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-sand text-deep font-body">
      <div className="mx-auto w-full px-4 md:px-6">{children}</div>
    </div>
  );
}
