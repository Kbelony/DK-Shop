import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { MenuOverlay } from "./MenuOverlay";
import { goToSection } from "@/lib/smoothScroll";

interface NavbarProps {
  translucent?: boolean;
}

export function Navbar({ translucent = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const light = translucent;

  const goHome = () => {
    goToSection("top", navigate);
  };

  return (
    <>
      <header className={clsx("fixed left-0 right-0 top-0 z-50 md:bg-transparent", !light && "bg-sand")}>
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={goHome}
            className={clsx(
              "font-display text-[26px] leading-6 tracking-[-0.04em]",
              light ? "text-white" : "text-ember"
            )}
            data-cursor="focus"
            aria-label="Deborah Kabongo, back to home"
          >
            Deborah Kabongo
          </button>

          <div
            className={clsx(
              "font-dm flex items-center gap-10 text-base font-bold",
              light ? "text-white" : "text-deep"
            )}
          >
            <span className="hidden sm:inline">Handmade clothing</span>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-3"
              data-cursor="focus"
              aria-label="Open navigation menu"
            >
              Menu
              <span className="relative block h-[7px] w-[18px]">
                <span className="absolute inset-x-0 top-0 h-[1.5px] bg-current" />
                <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
