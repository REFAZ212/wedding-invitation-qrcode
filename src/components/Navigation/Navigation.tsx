import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiImage,
  FiCheckSquare,
  FiMessageCircle,
  FiGift,
} from "react-icons/fi";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: FiHome },
  { id: "couple", label: "Couple", icon: FiUsers },
  { id: "event", label: "Event", icon: FiCalendar },
  { id: "gallery", label: "Gallery", icon: FiImage },
  { id: "rsvp", label: "RSVP", icon: FiCheckSquare },
  { id: "wishes", label: "Wishes", icon: FiMessageCircle },
  { id: "gift", label: "Gift", icon: FiGift },
];

export default function Navigation() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Desktop sticky top nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-[70] items-center px-10 py-4 bg-night/80 backdrop-blur-md border-b border-gold/15">
        <span className="font-script text-2xl text-gold-light mr-auto">A &amp; B</span>
        <ul className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`text-sm tracking-wide uppercase transition-colors ${
                  active === item.id
                    ? "text-gold-light font-medium"
                    : "text-ivory/60 hover:text-gold-light"
                }`}
                aria-current={active === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile floating bottom nav */}
      <nav
        className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-[70] w-[94%] max-w-md"
        aria-label="Navigasi utama"
      >
        <ul className="flex items-center justify-between rounded-full bg-night-soft/95 backdrop-blur-md shadow-soft px-2 py-2 border border-gold/15">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="relative w-full flex flex-col items-center gap-1 py-1.5"
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-gold"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={17}
                    className={isActive ? "text-gold-light" : "text-ivory/50"}
                  />
                  <span
                    className={`text-[9px] leading-none ${
                      isActive ? "text-gold-light font-medium" : "text-ivory/40"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
