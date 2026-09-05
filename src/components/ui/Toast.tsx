"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/store/ui";

export default function Toast() {
  const toast = useUI((s) => s.toast);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[80] bg-navy-950 text-ivory px-6 py-3 rounded-full shadow-card text-sm font-medium"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
