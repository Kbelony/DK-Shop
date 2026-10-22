import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { scrollToId } from "@/lib/smoothScroll";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

// label -> section id on the landing page
const menuEntries = [
  { label: "Collection", id: "bakes" },
  { label: "About", id: "about" },
  { label: "News", id: "news" },
  { label: "Contact", id: "contact" },
];

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const navigate = useNavigate();

  // Close first, then glide to the section with Lenis (like the anchors of the reference)
  const go = (id: string) => {
    onClose();
    const run = () => window.setTimeout(() => scrollToId(id), 250);
    if (window.location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => scrollToId(id), 500);
    } else {
      run();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-sand px-4 py-4 md:px-6"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => go("top")}
              className="font-display text-[26px] leading-6 tracking-[-0.04em] text-ember"
              data-cursor="focus"
              aria-label="Back to home"
            >
              DK-Shop
            </button>
            <div className="font-dm flex items-center gap-10 text-base font-bold text-deep">
              <span className="hidden sm:inline">Handmade clothing</span>
              <button
                onClick={onClose}
                className="flex items-center gap-2"
                data-cursor="focus"
              >
                Close <span className="text-2xl leading-none">×</span>
              </button>
            </div>
          </div>

          <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_auto]">
            <nav className="space-y-2">
              {menuEntries.map((entry, index) => (
                <motion.button
                  key={entry.id}
                  onClick={() => go(entry.id)}
                  className="font-display block w-full text-left text-[56px] leading-[1] lg:text-[96px]"
                  data-cursor="focus"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  {entry.label}
                </motion.button>
              ))}
            </nav>
            <div className="font-dm space-y-6 text-base text-deep lg:text-right">
              <div>
                <p className="text-2xl font-bold">/Contact Info</p>
                <p className="text-greyText">hello@dk-shop.com</p>
                <p className="text-greyText">+00 000 000 000</p>
              </div>
              <div>
                <p className="text-2xl font-bold">/Studio</p>
                <p className="text-greyText">By appointment only</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
