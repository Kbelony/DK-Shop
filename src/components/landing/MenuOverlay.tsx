import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

const menuEntries = ["Home", "Bakes", "About", "News", "Contact"];

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-sand/95 backdrop-blur-sm px-6 sm:px-10 lg:px-20 py-8"
        >
          <div className="flex items-start justify-between text-sm uppercase tracking-wide">
            <span className="font-heading text-lg text-ember">Bakeat</span>
            <div className="flex items-center gap-6 text-deep/70">
              <span>London, UK</span>
              <button
                onClick={onClose}
                className="flex items-center gap-2 font-heading text-base text-deep data-[cursor='focus']"
                data-cursor="focus"
              >
                Close <span className="text-2xl leading-none">×</span>
              </button>
            </div>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_auto]">
            <div className="space-y-4">
              {menuEntries.map((entry, index) => (
                <motion.a
                  key={entry}
                  href="#"
                  className="block text-5xl sm:text-6xl font-heading text-deep leading-tight"
                  data-cursor="focus"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  {entry}
                </motion.a>
              ))}
            </div>
            <div className="space-y-6 text-right text-sm uppercase tracking-wide text-deep/60">
              <div>
                <p className="text-deep">/Contact info</p>
                <p className="text-base font-medium text-deep">hello@bakeat.com</p>
                <p className="text-base font-medium text-deep">+44 20 1234 5678</p>
              </div>
              <div>
                <p className="text-deep">/Address</p>
                <p>21 Bloomsbury Way, WC1A 2TH</p>
              </div>
              <Button
                className="rounded-full bg-deep px-8 py-5 text-base font-heading tracking-wide"
                onClick={onClose}
                data-cursor="focus"
              >
                Book a visit
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

