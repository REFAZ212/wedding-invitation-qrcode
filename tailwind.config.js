/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ivory: "#FBF7F0",
        cream: "#F3EAD8",
        champagne: "#EFE0BF",
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E4C97D",
          dark: "#9C7A2E",
        },
        sage: {
          DEFAULT: "#7C8B6F",
          light: "#A9B79A",
          dark: "#4A5D45",
        },
        charcoal: "#2E2A24",
        // dark mode surface
        night: {
          DEFAULT: "#171512",
          soft: "#221F1A",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        script: ["'Alex Brush'", "cursive"],
        body: ["'Jost'", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E4C97D 0%, #C9A24B 50%, #9C7A2E 100%)",
        "sage-gradient": "linear-gradient(135deg, #A9B79A 0%, #7C8B6F 100%)",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(46, 42, 36, 0.15)",
        glass: "0 8px 32px 0 rgba(156, 122, 46, 0.15)",
        gold: "0 4px 20px -4px rgba(201, 162, 75, 0.4)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "fall": "fall linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fadeUp 0.9s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(4deg)" },
        },
        fall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(360deg)", opacity: "0.2" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
