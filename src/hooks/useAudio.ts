import { useEffect, useRef, useState } from "react";

interface UseAudioReturn {
  isPlaying: boolean;
  isMuted: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  toggleMute: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

/**
 * Mengelola elemen <audio> musik latar.
 * Musik TIDAK PERNAH autoplay — hanya dimulai lewat panggilan play() eksplisit
 * (mis. setelah pengguna menekan tombol "Buka Undangan").
 */
export function useAudio(src: string): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.55;
  }, [src]);

  const play = () => {
    audioRef.current
      ?.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const toggle = () => (isPlaying ? pause() : play());

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  return { isPlaying, isMuted, play, pause, toggle, toggleMute, audioRef };
}
