"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";

// Thought fragments - full screen distribution with opacity based on size
const thoughts = [
  {
    text: "No puedo más",
    x: 15,
    y: 12,
    rotation: -8,
    size: "text-3xl",
    opacity: 1,
  },
  {
    text: "¿Por qué me siento así?",
    x: 72,
    y: 18,
    rotation: 5,
    size: "text-sm",
    opacity: 0.4,
  },
  {
    text: "Nadie me entiende",
    x: 25,
    y: 35,
    rotation: -3,
    size: "text-2xl",
    opacity: 0.85,
  },
  {
    text: "Estoy agotad@",
    x: 68,
    y: 42,
    rotation: 6,
    size: "text-xl",
    opacity: 0.7,
  },
  {
    text: "Todo me supera",
    x: 12,
    y: 55,
    rotation: -10,
    size: "text-3xl",
    opacity: 1,
  },
  {
    text: "Me siento sol@",
    x: 78,
    y: 28,
    rotation: 4,
    size: "text-base",
    opacity: 0.5,
  },
  {
    text: "No sé qué hacer",
    x: 45,
    y: 68,
    rotation: -6,
    size: "text-sm",
    opacity: 0.4,
  },
  {
    text: "Necesito ayuda",
    x: 55,
    y: 15,
    rotation: 8,
    size: "text-2xl",
    opacity: 0.85,
  },
  {
    text: "¿Esto es normal?",
    x: 18,
    y: 78,
    rotation: -4,
    size: "text-lg",
    opacity: 0.6,
  },
  {
    text: "No quiero molestar",
    x: 82,
    y: 58,
    rotation: 7,
    size: "text-sm",
    opacity: 0.4,
  },
  {
    text: "Estoy perdid@",
    x: 38,
    y: 45,
    rotation: -9,
    size: "text-xl",
    opacity: 0.7,
  },
  {
    text: "Me cuesta respirar",
    x: 62,
    y: 72,
    rotation: 3,
    size: "text-3xl",
    opacity: 1,
  },
  {
    text: "No tengo fuerzas",
    x: 28,
    y: 25,
    rotation: -5,
    size: "text-base",
    opacity: 0.5,
  },
  {
    text: "¿Qué me pasa?",
    x: 75,
    y: 82,
    rotation: 6,
    size: "text-lg",
    opacity: 0.6,
  },
];

// Rotating phrases for left column tagline
const taglinePhrases = [
  "escucharte en todo momento",
  "apoyarte a crecer",
  "acompañarte en lo difícil",
  "celebrar tus logros",
  "ayudarte a encontrar tu camino",
];

// Rotating phrases for speech bubble
const speechPhrases = [
  "Aquí estoy para ti",
  "Cuéntame todo",
  "No estás sol@",
  "Vamos juntos",
  "Te escucho",
];

// Chat simulation messages for Section 2
const chatMessages = [
  { role: "roma", text: "Hola, soy Roma. ¿Y tú quién eres?" },
  { role: "user", text: "Me siento solo, nadie me habla" },
  {
    role: "roma",
    text: "Lamento eso. A veces la vida nos muestra quién realmente se queda. ¿Podrías escribirle a alguien sin ningún motivo, solo para saber cómo está?",
  },
  {
    role: "user",
    text: "Podría, pero siento que si llamo yo primero es como admitir que me importa más",
  },
  {
    role: "roma",
    text: "Y tu amigo probablemente piensa lo mismo — entonces ninguno actúa. Es un bucle donde nadie toma acción. ¡Vamos, puedes hacerlo!",
  },
  { role: "user", text: "Tienes razón... le voy a escribir" },
  {
    role: "roma",
    text: "Eso es. Una acción pequeña puede cambiar todo. Cuéntame cómo te fue 🤍",
  },
];

// Animation timing constants (in seconds)
const TIMING = {
  thoughtStagger: 0.3, // 0.3s between each word
  thoughtsComplete: 4.2, // 14 × 0.3s = when all words visible
  shakeDuration: 1, // 1s shake phase
  romaAppear: 5.2, // after shake ends (4.2 + 1)
  layoutTransition: 7, // transition to two-column
  contentAppear: 8, // title, tagline, CTA appear
  speechBubble: 8.5, // speech bubble appears
  phraseInterval: 3, // 3s per phrase rotation
  fadeOut: 24, // start fading out
  loopRestart: 26, // loop restarts
};

// Color interpolation helper
function interpolateColor(
  color1: string,
  color2: string,
  progress: number,
): string {
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * progress);
  const g = Math.round(g1 + (g2 - g1) * progress);
  const b = Math.round(b1 + (b2 - b1) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}

function ThoughtFragment({
  text,
  x,
  y,
  rotation,
  index,
  phase,
  size,
  opacity,
}: {
  text: string;
  x: number;
  y: number;
  rotation: number;
  index: number;
  phase: "entering" | "shake" | "falling" | "hidden";
  size: string;
  opacity: number;
}) {
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
      y: 10,
    },
    entering: {
      opacity: opacity,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
        delay: index * TIMING.thoughtStagger,
      },
    },
    shake: {
      opacity: [opacity, opacity * 0.7, opacity, opacity * 0.85, opacity],
      scale: [1, 1.02 + index * 0.005, 0.98, 1.01, 1],
      x: [0, -3 - (index % 3), 4 + (index % 2), -2, 3, -1, 0],
      y: [0, 2 + (index % 2), -3, 4 - (index % 3), -2, 1, 0],
      rotate: [0, -2 - (index % 2), 1.5, -1, 2 + (index % 3), 0],
      transition: {
        duration: 0.8 + (index % 3) * 0.15,
        repeat: Infinity,
        ease: "easeInOut" as const,
        times: [0, 0.15, 0.35, 0.5, 0.7, 0.85, 1],
      },
    },
    falling: {
      opacity: 0,
      y: 800,
      scale: 0.8,
      rotate: 15 + index * 3,
      transition: {
        duration: 0.6 + index * 0.04,
        ease: [0.55, 0.055, 0.675, 0.19] as const,
        delay: index * 0.02,
      },
    },
  };

  return (
    <motion.span
      className={`absolute ${size} font-normal select-none pointer-events-none`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        color: "#FAF0E6",
        transform: `rotate(${rotation}deg)`,
        textShadow: "0 1px 3px rgba(0,0,0,0.4)",
      }}
      variants={variants}
      initial="hidden"
      animate={phase}
    >
      {text}
    </motion.span>
  );
}

// Arrow icon component
function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ml-2"
    >
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Chat bubble component for Section 2
function ChatBubble({ role, text }: { role: string; text: string }) {
  const isRoma = role === "roma";

  return (
    <motion.div
      className={`flex ${isRoma ? "justify-start" : "justify-end"} mb-4`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.5, margin: "-20px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div
        className="max-w-xs md:max-w-sm lg:max-w-md px-4 py-3 text-base font-normal"
        style={{
          backgroundColor: isRoma ? "#FFFFFF" : "#E8A0AC",
          border: isRoma ? "2px solid #C4697A" : "none",
          borderRadius: isRoma ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
          color: "#2C1A1A",
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}

const radialMask = {
  maskImage:
    "radial-gradient(ellipse 75% 75% at center, black 50%, transparent 100%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 75% 75% at center, black 50%, transparent 100%)",
  mixBlendMode: "multiply" as const,
};


function AutoPlayVideo({
  src,
  className,
  style,
}: {
  src: string;
  className: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const tryPlay = () => { video.play().catch(() => {}); };
    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
      return () => video.removeEventListener("canplay", tryPlay);
    }
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      playsInline
      preload="auto"
      style={style}
    />
  );
}

function ViewportVideo({ src, className }: { src: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      playsInline
      style={radialMask}
    />
  );
}

export default function Home() {
  const [phase, setPhase] = useState<
    "entering" | "shake" | "falling" | "hidden"
  >("hidden");
  const [showRomaCenter, setShowRomaCenter] = useState(false);
  const [showTwoColumn, setShowTwoColumn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [bgProgress, setBgProgress] = useState(0);

  // Background color based on progress
  const backgroundColor = useMemo(() => {
    return interpolateColor("#FDF6EC", "#2C1A1A", bgProgress);
  }, [bgProgress]);

  // Background darkening effect during chaos
  useEffect(() => {
    if (phase === "hidden") {
      setBgProgress(0);
      return;
    }

    if (phase === "entering") {
      // Gradually darken as thoughts appear
      const totalThoughts = thoughts.length;
      const interval = setInterval(() => {
        setBgProgress((prev) => {
          const next = prev + 0.85 / totalThoughts;
          return next > 0.85 ? 0.85 : next;
        });
      }, TIMING.thoughtStagger * 1000);

      return () => clearInterval(interval);
    }

    // bgProgress reset to 0 is handled directly in the romaAppear setTimeout

  }, [phase]);

  // Phrase rotation effect
  useEffect(() => {
    if (!showContent) {
      setPhraseIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % taglinePhrases.length);
    }, TIMING.phraseInterval * 1000);

    return () => clearInterval(interval);
  }, [showContent]);

  useEffect(() => {
    const runAnimation = () => {
      // Reset everything
      setPhase("hidden");
      setShowRomaCenter(false);
      setShowTwoColumn(false);
      setShowContent(false);
      setShowSpeechBubble(false);
      setPhraseIndex(0);
      setBgProgress(0);

      // Phase 1: Thoughts start entering
      setTimeout(() => setPhase("entering"), 100);

      // Phase 2: All words visible, start shake
      setTimeout(() => setPhase("shake"), TIMING.thoughtsComplete * 1000);

      // Phase 3: thoughts clear, background starts transitioning to cream
      setTimeout(() => {
        setPhase("falling");
        setBgProgress(0);
      }, TIMING.romaAppear * 1000);

      // Phase 3 (+1s): Roma appears after background is cream
      setTimeout(() => {
        setShowRomaCenter(true);
      }, (TIMING.romaAppear + 1) * 1000);

      // Phase 3.5: Transition to two-column layout (+1s to preserve Roma visibility)
      setTimeout(() => {
        setShowRomaCenter(false);
        setShowTwoColumn(true);
      }, (TIMING.layoutTransition + 1) * 1000);

      // Phase 4: Content appears (+1s)
      setTimeout(() => setShowContent(true), (TIMING.contentAppear + 1) * 1000);

      // Speech bubble appears slightly after (+1s)
      setTimeout(() => setShowSpeechBubble(true), (TIMING.speechBubble + 1) * 1000);

      // Fade out everything before loop
      setTimeout(() => {
        setShowTwoColumn(false);
        setShowContent(false);
        setShowSpeechBubble(false);
      }, TIMING.fadeOut * 1000);

      // Restart loop
      setTimeout(() => {
        setCycleKey((prev) => prev + 1);
      }, TIMING.loopRestart * 1000);
    };

    runAnimation();
  }, [cycleKey]);

  return (
    <>
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "#FDF6EC",
          padding: "0 24px",
          height: "64px",
          overflow: "hidden",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-full">
          <img
            src="/vamvu-logo-granate.png"
            alt="Vamvoo"
            style={{ height: "140px" }}
          />
          <Link
            href="/chat"
            className="text-sm font-normal transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#6B1D2E",
              color: "#FAF0E6",
              padding: "8px 20px",
              borderRadius: "20px",
            }}
          >
            Hablar con Roma
          </Link>
        </div>
      </header>

      <motion.main
        className="relative min-h-screen w-full overflow-hidden"
        animate={{ backgroundColor }}
        transition={{ duration: phase === "falling" ? 1.0 : 0.3 }}
      >
        {/* Preload Phase 3 video so it's ready before showRomaCenter triggers */}
        <video
          src="/roma-neutral-loop-wb.webm"
          preload="auto"
          muted
          playsInline
          style={{ display: "none" }}
        />

        {/* Thought fragments layer */}
        <div className="absolute inset-0" key={cycleKey}>
          {thoughts.map((thought, index) => (
            <ThoughtFragment
              key={`${cycleKey}-${index}`}
              text={thought.text}
              x={thought.x}
              y={thought.y}
              rotation={thought.rotation}
              index={index}
              phase={phase}
              size={thought.size}
              opacity={thought.opacity}
            />
          ))}
        </div>

        {/* Roma centered - Phase 3 */}
        <AnimatePresence>
          {showRomaCenter && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <AutoPlayVideo
                src="/roma-neutral-loop-wb.webm"
                className="w-[500px] md:w-[680px] lg:w-[800px] h-auto object-contain"
                style={{ filter: "drop-shadow(0 8px 32px rgba(107,29,46,0.2))" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Two-column layout - Phase 4 */}
        <AnimatePresence>
          {showTwoColumn && (
            <motion.div
              className="absolute inset-0 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Left column - Text content */}
              <div className="flex-1 flex flex-col items-center md:items-start justify-center order-2 md:order-1 mt-8 md:mt-0">
                <AnimatePresence>
                  {showContent && (
                    <>
                      {/* Fixed title */}
                      <motion.h1
                        className="text-3xl md:text-4xl lg:text-5xl font-medium text-center md:text-left"
                        style={{ color: "#6B1D2E" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        La amiga para...
                      </motion.h1>

                      {/* Rotating tagline */}
                      <motion.div
                        className="mt-2 h-16 md:h-20 flex items-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={phraseIndex}
                            className="text-xl md:text-2xl lg:text-3xl font-normal text-center md:text-left"
                            style={{ color: "#2C1A1A" }}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          >
                            {taglinePhrases[phraseIndex]}
                          </motion.p>
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                          ease: "easeOut",
                        }}
                        className="mt-6"
                      >
                        <Link
                          href="/chat"
                          className="inline-flex items-center px-8 py-3 text-base font-medium text-white rounded-full transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "#6B1D2E" }}
                        >
                          Comenzar
                          <ArrowIcon />
                        </Link>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Right column - Roma avatar */}
              <div className="flex-1 flex items-center justify-center order-1 md:order-2 relative">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Speech bubble with rotating text */}
                  <AnimatePresence>
                    {showSpeechBubble && (
                      <motion.div
                        className="absolute -top-16 -right-4 md:right-0 px-4 py-2 rounded-2xl text-sm font-normal min-w-max"
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#2C1A1A",
                          border: "1px solid #EDD5C0",
                        }}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={phraseIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {speechPhrases[phraseIndex]}
                          </motion.span>
                        </AnimatePresence>
                        {/* Speech bubble tail */}
                        <div
                          className="absolute -bottom-2 left-6 w-4 h-4 rotate-45"
                          style={{
                            backgroundColor: "#FFFFFF",
                            borderRight: "1px solid #EDD5C0",
                            borderBottom: "1px solid #EDD5C0",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Roma avatar video */}
                  <video
                    className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-cover"
                    src="/roma-neutral-loop.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      maskImage:
                        "radial-gradient(ellipse 75% 75% at center, black 50%, transparent 100%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 75% 75% at center, black 50%, transparent 100%)",
                      mixBlendMode: "multiply",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      {/* Gradient transition between Hero and Section 2 */}
      <div
        className="h-32 md:h-48"
        style={{
          background:
            "linear-gradient(to bottom, #FDF6EC 0%, #F5EDE3 50%, #FDF6EC 100%)",
        }}
      />

      {/* Section 2: Chat Simulation */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FDF6EC" }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-medium text-center mb-12"
            style={{ color: "#6B1D2E" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Así es Roma
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1 space-y-4">
              {chatMessages.map((msg, index) => (
                <ChatBubble key={index} role={msg.role} text={msg.text} />
              ))}
            </div>
            <div
              className="flex-shrink-0 flex justify-center w-full md:w-auto"
              style={{
                position: "sticky",
                top: "120px",
                alignSelf: "flex-start",
              }}
            >
              <ViewportVideo
                src="/roma-neutral-to-empathetic.mp4"
                className="w-[280px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gradient transition to CTA */}
      <div
        className="h-24 md:h-32"
        style={{
          background: "linear-gradient(to bottom, #FDF6EC 0%, #F8F0E8 100%)",
        }}
      />

      {/* CTA Section */}
      <section
        className="py-16 px-6 text-center"
        style={{ backgroundColor: "#F8F0E8" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="text-2xl md:text-3xl font-normal mb-8"
            style={{ color: "#2C1A1A" }}
          >
            Roma está lista para escucharte
          </p>
          <div className="flex justify-center mb-8">
            <ViewportVideo
              src="/roma-empathetic-to-motivate.mp4"
              className="w-40 md:w-52 h-auto object-contain"
            />
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#6B1D2E" }}
          >
            Comenzar ahora
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6" style={{ backgroundColor: "#6B1D2E" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <span className="text-sm font-normal" style={{ color: "#FAF0E6" }}>
            Roma by Vamvoo labs
          </span>

          <span className="text-sm font-normal" style={{ color: "#FAF0E6" }}>
            Hecho con propósito
          </span>

          <Link
            href="/chat"
            className="text-sm font-normal transition-opacity hover:opacity-80"
            style={{ color: "#FAF0E6" }}
          >
            Comenzar
          </Link>
        </div>
      </footer>
    </>
  );
}
