import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { MenuOverlay } from "./MenuOverlay";
import { scrollToId } from "@/lib/smoothScroll";

interface NavbarProps {
  translucent?: boolean;
}

export function Navbar({ translucent = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const light = translucent;

  const goHome = () => {
    if (window.location.pathname === "/") scrollToId("top");
    else navigate("/");
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={goHome}
            className={clsx(
              "font-display text-[26px] leading-6 tracking-[-0.04em]",
              light ? "text-white" : "text-ember"
            )}
            data-cursor="focus"
            aria-label="Back to home"
          >
            DK-Shop
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
