"use client";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import React, { useRef, useState } from "react";

interface StepCardProps {
  title: string;
  description: string;
  index: number;
}

export function StepCard({ title, description, index }: StepCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className="relative group perspective-1000"
    >
      {/* Card */}
      <div className="relative p-6 rounded-[8px] bg-[#171717] border border-[#2e2e2e] overflow-hidden transition-all duration-300 group-hover:border-[rgba(62, 207, 142, 0.3)]">
        {/* Glow effect - Desktop only with mouse following */}
        <div className="hidden md:block">
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: useMotionTemplate`radial-gradient(800px circle at ${mouseXSpring.get() * 100 + 50}% ${mouseYSpring.get() * 100 + 50}%, rgba(62, 207, 142, 0.2), transparent 40%)`,
            }}
          />
        </div>
        
        {/* Mobile: Simple border effect */}
        <div className="md:hidden absolute inset-0 border-2 border-[#3ecf8e] rounded-[8px] opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-[24px] leading-[1.33] font-normal mb-3 text-[#fafafa] transition-colors duration-300 group-hover:text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
            {title}
          </h3>
          <p className="text-[14px] leading-[1.43] font-normal text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
