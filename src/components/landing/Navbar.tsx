import { useState } from "react";
import clsx from "clsx";
import { MenuOverlay } from "./MenuOverlay";

interface NavbarProps {
  translucent?: boolean;
}

export function Navbar({ translucent = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const textColor = translucent ? "text-white" : "text-deep";
  const subText = translucent ? "text-white/70" : "text-deep/60";

  return (
    <>
      <header
        className={clsx(
          "fixed left-0 right-0 top-0 z-50 transition-all",
          translucent ? "bg-transparent" : "bg-sand/95 backdrop-blur"
        )}
      >
        <div className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
          <div className="space-y-1">
            <p
              className={clsx(
                "font-heading text-sm uppercase tracking-[0.4em]",
                translucent ? "text-ember/80" : "text-ember"
              )}
            >
              Bakeat
            </p>
            <p className={clsx("text-xs uppercase tracking-[0.4em]", subText)}>
              Handmade ovens &amp; crumbs since 1998
            </p>
          </div>

          <div
            className={clsx(
              "hidden items-center gap-6 text-xs uppercase tracking-[0.35em] sm:flex",
              subText
            )}
          >
            <span>London, UK</span>
            <span>Open 8 — 4</span>
          </div>

          <button
            onClick={() => setOpen(true)}
            className={clsx(
              "flex items-center gap-3 rounded-full border px-5 py-2 font-heading text-base transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              translucent
                ? "border-white/40 text-white hover:border-white"
                : "border-deep/30 text-deep hover:border-deep/60"
            )}
            data-cursor="focus"
            aria-label="Open navigation menu"
          >
            Menu
            <span className="relative h-3 w-4">
              <span
                className={clsx(
                  "absolute inset-x-0 top-0 h-[2px]",
                  textColor === "text-white" ? "bg-white" : "bg-deep"
                )}
              />
              <span
                className={clsx(
                  "absolute inset-x-0 bottom-0 h-[2px]",
                  textColor === "text-white" ? "bg-white" : "bg-deep"
                )}
              />
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
