"use client";

import React from "react"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Eye, Edit3, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "1 – Input",
    description:
      "Provide detailed scene descriptions with location, cast, stunts, and technical requirements.",
    icon: <Upload className="w-5 h-5" />,
    image: "/images/solution-learn.png",
  },
  {
    id: 2,
    title: "2 – Review",
    description:
      "Get structured, explainable insights on feasibility challenges, risks, and cost drivers for your scene.",
    icon: <Eye className="w-5 h-5" />,
    image: "/images/solution-detect.png",
  },
  {
    id: 3,
    title: "3 – Adjust",
    description:
      "Use these insights to refine your planning, adjust logistics, and avoid costly surprises on set.",
    icon: <Edit3 className="w-5 h-5" />,
    image: "/images/solution-neutralize.png",
  },
];

export function SolutionSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-zinc-900 text-white py-24 flex flex-col items-center overflow-hidden border-b border-zinc-700/30">
      <div className="max-w-7xl w-full px-6 md:px-12 lg:px-16 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col gap-4 max-w-[560px]">
          <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit">
            <div className="w-2.5 h-2.5 bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400 tracking-wide">
              How It Works
            </span>
          </div>
          <h2 className="text-balance text-4xl md:text-5xl font-normal leading-[1.1] tracking-tight text-white">
            {"Three Simple Steps to Smart Planning".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ filter: "blur(10px)", opacity: 0 }}
                whileInView={{ filter: "blur(0px)", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <p className="text-balance text-zinc-400 text-base leading-relaxed">
            SceneGuard supports early-stage decision-making for film production teams. It complements creative judgment by providing structured, explainable insights during planning.
          </p>
        </div>

        {/* Interactive Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[400px]">
          {/* Left: Image Display */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={features[activeIndex].image || "/placeholder.svg"}
                  alt={features[activeIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="absolute bottom-4 left-4 right-4 h-1 flex gap-2">
              {features.map((_, idx) => (
                <div
                  key={idx}
                  className="h-full flex-1 bg-white/10 overflow-hidden"
                >
                  {activeIndex === idx && (
                    <motion.div
                      className="h-full bg-amber-500/80"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 8, ease: "linear" }}
                    />
                  )}
                  {idx < activeIndex && (
                    <div className="h-full w-full bg-amber-500/80" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Step List */}
          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "group relative w-full text-left p-6 transition-all duration-300 outline-none",
                  activeIndex === index
                    ? "bg-white/[0.03] border border-white/10"
                    : "bg-transparent border border-transparent hover:bg-white/[0.01]"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "mt-1 p-2 transition-colors duration-300",
                      activeIndex === index
                        ? "bg-amber-500 text-black"
                        : "bg-white/5 text-zinc-500"
                    )}
                  >
                    {feature.icon}
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3
                      className={cn(
                        "text-xl font-medium transition-colors duration-300",
                        activeIndex === index ? "text-white" : "text-zinc-500"
                      )}
                    >
                      {feature.title}
                    </h3>

                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-zinc-400 text-base leading-relaxed overflow-hidden"
                        >
                          {feature.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div
                    className={cn(
                      "mt-1.5 transition-all duration-300",
                      activeIndex === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2"
                    )}
                  >
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer/CTA Area */}
        <div className="pt-12 flex justify-center border-t border-white/5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-black font-medium flex items-center gap-2"
          >
            Get Started
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
