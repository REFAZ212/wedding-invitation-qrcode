import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiRefreshCw } from "react-icons/fi";

import { useAudio } from "@/hooks/useAudio";
import { useInvitation } from "@/hooks/useInvitation";
import { weddingConfig } from "@/data/config";

import Loading from "@/components/Loading/Loading";
import Cover from "@/components/Cover/Cover";
import Confetti from "@/components/FloatingElements/Confetti";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import Navigation from "@/components/Navigation/Navigation";
import ScrollProgress from "@/components/ScrollProgress/ScrollProgress";
import CursorGlow from "@/components/FloatingElements/CursorGlow";
import { FallingPetals } from "@/components/FloatingElements/FloatingElements";
import InvitationNotFound from "@/pages/InvitationNotFound";

import Hero from "@/components/Hero/Hero";
import Couple from "@/components/Couple/Couple";
import Timeline from "@/components/Timeline/Timeline";
import Event from "@/components/Event/Event";
import Gallery from "@/components/Gallery/Gallery";
import Moments from "@/components/Moments/Moments";
import PreWeddingVideo from "@/components/Moments/PreWeddingVideo";
import RSVP from "@/components/RSVP/RSVP";
import Wishes from "@/components/Wishes/Wishes";
import Gift from "@/components/Gift/Gift";
import Envelope from "@/components/Envelope/Envelope";
import InstagramFilter from "@/components/Moments/InstagramFilter";
import Protocol from "@/components/Protocol/Protocol";
import InvitationQR from "@/components/Footer/InvitationQR";
import Footer from "@/components/Footer/Footer";

function InvitationContent({
  qrToken,
  maxGuests,
  checkedIn,
}: {
  qrToken: string;
  maxGuests: number;
  checkedIn: boolean;
}) {
  return (
    <>
      <Hero />
      <Couple />
      <Timeline />
      <Event />
      <Gallery />
      <Moments />
      <PreWeddingVideo />
      <RSVP />
      <Wishes />
      <Gift />
      <Envelope />
      <InstagramFilter />
      <Protocol />
      <InvitationQR qrToken={qrToken} maxGuests={maxGuests} checkedIn={checkedIn} />
      <Footer />
    </>
  );
}

function ConnectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-ivory dark:bg-night px-6 text-center">
      <p className="font-display text-xl text-charcoal dark:text-ivory">
        Tidak dapat memuat undangan
      </p>
      <p className="text-sm text-charcoal/60 dark:text-ivory/60 max-w-xs">
        Periksa koneksi internet Anda, lalu coba lagi.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 rounded-full bg-gold-gradient text-ivory text-sm font-medium px-5 py-2.5 shadow-gold"
      >
        <FiRefreshCw size={14} /> Coba Lagi
      </button>
    </div>
  );
}

export default function InvitationPage() {
  const { code } = useParams<{ code: string }>();
  const { invitation, loading: invitationLoading, notFound, error } = useInvitation(code);

  const [assetsProgress, setAssetsProgress] = useState(0);
  const [isAssetsLoading, setIsAssetsLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  const audio = useAudio(weddingConfig.music.src);

  // Simulasi progres loading aset awal aplikasi
  useEffect(() => {
    const interval = setInterval(() => {
      setAssetsProgress((prev) => {
        const next = prev + Math.random() * 18;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsAssetsLoading(false), 350);
          return 100;
        }
        return next;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [retryTick]);

  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    document.title = weddingConfig.meta.siteTitle;
  }, []);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    audio.play();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1800);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    document.body.style.overflow = isOpened ? "auto" : "hidden";
  }, [isOpened]);

  const isLoading = isAssetsLoading || invitationLoading;

  if (!isLoading && notFound) {
    return <InvitationNotFound variant="invalid" />;
  }

  if (!isLoading && error) {
    return <ConnectionError onRetry={() => setRetryTick((t) => t + 1)} />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loading key="loading" progress={assetsProgress} />}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && !isOpened && invitation && (
          <Cover key="cover" guestName={invitation.guestName} onOpen={handleOpenInvitation} />
        )}
      </AnimatePresence>

      <AnimatePresence>{showConfetti && <Confetti key="confetti" />}</AnimatePresence>

      {isOpened && invitation && (
        <div className="relative min-h-screen bg-ivory dark:bg-night text-charcoal dark:text-ivory transition-colors duration-500">
          <ScrollProgress />
          <CursorGlow />
          <FallingPetals />
          <Navigation />
          <main className="pb-24 md:pb-0">
            <InvitationContent
              qrToken={invitation.qrToken}
              maxGuests={invitation.maxGuests}
              checkedIn={invitation.checkedIn}
            />
          </main>
          <AudioPlayer audio={audio} />
        </div>
      )}
    </>
  );
}
