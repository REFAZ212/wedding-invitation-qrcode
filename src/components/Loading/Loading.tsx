import { motion } from "framer-motion";
import Ornament from "@/components/Ornament/Ornament";

interface LoadingProps {
  progress: number;
}

export default function Loading({ progress }: LoadingProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ivory dark:bg-night"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <Ornament variant="monogram" className="w-20 h-20 text-gold animate-spin-slow" />
        <p className="font-script text-3xl text-gold-dark dark:text-gold-light">A &amp; B</p>
        <div className="w-48 h-[2px] bg-cream dark:bg-night-soft rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold-gradient"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
        <p className="text-xs tracking-[0.3em] uppercase text-charcoal/50 dark:text-ivory/50">
          Memuat Undangan · {Math.round(progress)}%
        </p>
      </motion.div>
    </motion.div>
  );
}
