"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    quote:
      "SceneGuard's AI analysis caught a major stunt risk in our action sequence that our experienced coordinators missed. The detailed risk assessment and mitigation strategies saved us from a potential disaster and kept our crew safe.",
    author: "Michael Torres",
    role: "STUNT COORDINATOR AT ACTION FILMS INC",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=6B5B95",
  },
  {
    id: 2,
    quote:
      "We were over budget on our outdoor shoots due to weather delays. SceneGuard's weather feasibility analysis and cost impact predictions helped us reschedule efficiently, saving us $250K in production costs.",
    author: "Lisa Chen",
    role: "PRODUCTION MANAGER AT INDEPENDENT PICTURES",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=88498F",
  },
  {
    id: 3,
    quote:
      "The comprehensive scene analysis revealed hidden complexities in what seemed like a simple dialogue scene. The constraint intelligence helped us plan better, avoiding costly reshoots and keeping us on schedule.",
    author: "David Rodriguez",
    role: "FIRST ASSISTANT DIRECTOR AT STUDIO PRODUCTIONS",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=C55A7B",
  },
  {
    id: 4,
    quote:
      "SceneGuard transformed our pre-production process. What used to take days of manual risk assessment now happens in minutes with AI-powered insights. Our safety record has never been better.",
    author: "Sarah Kim",
    role: "PRODUCTION SUPERVISOR AT MAJOR STUDIOS",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=4A5899",
  },
  {
    id: 5,
    quote:
      "After a near-miss with crowd control on our last film, we needed better risk management. SceneGuard's predictive analysis has prevented multiple safety incidents and given us confidence in our shoots.",
    author: "James Walsh",
    role: "LOCATION MANAGER AT EPIC ENTERTAINMENT",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=6B7280",
  },
  {
    id: 6,
    quote:
      "The cost analysis feature is incredible. SceneGuard helps us make informed decisions about scene complexity versus budget constraints, optimizing our production value without compromising safety or quality.",
    author: "Emma Martinez",
    role: "LINE PRODUCER AT BUDGET FILMS",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=7C3AED",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="w-full bg-zinc-900 py-24 md:py-32 border-b border-zinc-700/30">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-16">
          <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit">
            <div className="w-2.5 h-2.5 bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400 tracking-wide">
              Testimonials
            </span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <h2 className="text-balance text-4xl md:text-5xl font-normal text-white">
              {"What Film Professionals Say About SceneGuard.".split(" ").map((word, i) => (
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
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={prevTestimonial}
                className="p-3 border border-zinc-700 bg-transparent text-white hover:bg-zinc-800 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 border border-zinc-700 bg-transparent text-white hover:bg-zinc-800 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {testimonials
            .slice(currentIndex, currentIndex + 3)
            .concat(
              testimonials.slice(
                0,
                Math.max(0, currentIndex + 3 - testimonials.length)
              )
            )
            .map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`p-8 border-zinc-700/30 ${
                  index !== 2 ? "md:border-r border-b md:border-b-0" : ""
                }`}
              >
                {/* Quote Icon */}
                <div className="text-amber-500 text-4xl font-bold mb-6">"</div>

                {/* Testimonial Text */}
                <p className="text-white text-base leading-relaxed mb-8 min-h-[200px]">
                  {testimonial.quote}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-12 h-12 object-cover"
                  />
                  <div>
                    <div className="text-white font-medium text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-zinc-500 text-xs uppercase tracking-wider">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
