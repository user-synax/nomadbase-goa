"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroTextProps {
  text?: string;
  className?: string;
  onAnimationComplete?: () => void;
}

export default function HeroText({
  text = "NOMADBASE",
  className = "",
  onAnimationComplete,
}: HeroTextProps) {
  const [isVisible, setIsVisible] = useState(true);
  const characters = text.split("");
  const animationDuration = 2.5; // Total animation duration in seconds

  useEffect(() => {
    // Auto-hide after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 500); // Call after blur-out completes
      }
    }, (animationDuration + 1) * 1000); // Add buffer time

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center h-screen w-full 
          bg-[#171717] transition-colors duration-700 ${className}`}
        >
          {/* Immersive Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)`,
              backgroundSize: "clamp(20px, 5vw, 60px) clamp(20px, 5vw, 60px)",
            }}
          />

          {/* Main Text Container */}
          <div className="relative z-10 w-full px-4 flex flex-col items-center">
            <motion.div
              className="flex flex-wrap justify-center items-center w-full"
            >
              {characters.map((char, i) => (
                <div
                  key={i}
                  className="relative px-[0.1vw] overflow-hidden group"
                >
                  {/* Main Character - Responsive sizing using vw */}
                  <motion.span
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: i * 0.04 + 0.3, duration: 0.8 }}
                    className="text-[12vw] leading-none font-black text-[#fafafa] tracking-tighter"
                    style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>

                  {/* Top Slice Layer */}
                  <motion.span
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "100%", opacity: [0, 1, 0] }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.04,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 text-[15vw] leading-none font-black text-[#3ecf8e] z-10 pointer-events-none"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
                  >
                    {char}
                  </motion.span>

                  {/* Middle Slice Layer */}
                  <motion.span
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: "-100%", opacity: [0, 1, 0] }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.04 + 0.1,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 text-[15vw] leading-none font-black text-[#898989] z-10 pointer-events-none"
                    style={{
                      clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)",
                    }}
                  >
                    {char}
                  </motion.span>

                  {/* Bottom Slice Layer */}
                  <motion.span
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "100%", opacity: [0, 1, 0] }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.04 + 0.2,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 text-[15vw] leading-none font-black text-[#3ecf8e] z-10 pointer-events-none"
                    style={{
                      clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)",
                    }}
                  >
                    {char}
                  </motion.span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-8 left-8 border-l border-t border-[#2e2e2e] w-12 h-12" />
          <div className="absolute bottom-8 right-8 border-r border-b border-[#2e2e2e] w-12 h-12" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
