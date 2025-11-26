import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-sand text-deep font-body">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-20 lg:space-y-28">
        {children}
      </div>
    </div>
  );
}
