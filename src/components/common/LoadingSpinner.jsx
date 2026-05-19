"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ label = "Loading amazing ideas..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-12 w-12 rounded-full border-4 border-violet-500/20 border-t-violet-500"
      />
      <p className="text-muted text-sm">{label}</p>
    </div>
  );
}
