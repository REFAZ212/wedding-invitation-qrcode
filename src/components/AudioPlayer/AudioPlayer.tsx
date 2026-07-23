import { motion } from "framer-motion";
import { FiMusic, FiVolume2, FiVolumeX } from "react-icons/fi";
import { weddingConfig } from "@/data/config";
import type { useAudio } from "@/hooks/useAudio";

interface AudioPlayerProps {
  audio: ReturnType<typeof useAudio>;
}

/** Kontrol musik latar mengambang di pojok kanan bawah. */
export default function AudioPlayer({ audio }: AudioPlayerProps) {
  const { isPlaying, isMuted, toggle, toggleMute, audioRef } = audio;

  return (
    <>
      <audio ref={audioRef} src={weddingConfig.music.src} preload="none" />

      <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-[80] flex flex-col items-center gap-2">
        <motion.button
          type="button"
          onClick={toggle}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-gold-gradient shadow-gold flex items-center justify-center text-ivory relative"
          aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
          aria-pressed={isPlaying}
        >
          <motion.span
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={isPlaying ? { repeat: Infinity, duration: 6, ease: "linear" } : { duration: 0.3 }}
            className="flex"
          >
            <FiMusic size={20} />
          </motion.span>
          {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-gold-light animate-ping opacity-40" />
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={toggleMute}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-full bg-ivory/90 dark:bg-night-soft/90 backdrop-blur-sm shadow-soft flex items-center justify-center text-gold-dark dark:text-gold-light"
          aria-label={isMuted ? "Aktifkan suara" : "Bisukan suara"}
          aria-pressed={isMuted}
        >
          {isMuted ? <FiVolumeX size={15} /> : <FiVolume2 size={15} />}
        </motion.button>
      </div>
    </>
  );
}
