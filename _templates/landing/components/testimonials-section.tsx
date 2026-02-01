"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    quote:
      "Skydda's AI sentinel detected a zero-day vulnerability in our infrastructure before any traditional security tool even flagged it. The autonomous patching feature saved us from what could have been a catastrophic breach.",
    author: "Sarah Chen",
    role: "CHIEF INFORMATION SECURITY OFFICER AT TECHCORP",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=6B5B95",
  },
  {
    id: 2,
    quote:
      "We were drowning in false positives from our legacy firewall. Skydda cut through the noise with surgical precision, reducing our alert fatigue by 90% while actually improving our threat detection rate.",
    author: "Marcus Rodriguez",
    role: "VP OF SECURITY OPERATIONS AT FINTECH GLOBAL",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=88498F",
  },
  {
    id: 3,
    quote:
      "The dark web reconnaissance feature alerted us to leaked credentials from a third-party vendor breach hours before it hit the news. That early warning gave us time to rotate everything and avoid compromise.",
    author: "Emily Thompson",
    role: "DIRECTOR OF CYBERSECURITY AT HEALTHCARE UNITED",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=C55A7B",
  },
  {
    id: 4,
    quote:
      "Implementing Skydda was the easiest security upgrade we've ever done. The system learned our network patterns in days, not months. Now it operates like an extension of our team, catching threats we didn't even know existed.",
    author: "David Kim",
    role: "CHIEF TECHNOLOGY OFFICER AT CLOUDSCALE",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=4A5899",
  },
  {
    id: 5,
    quote:
      "After a ransomware attack nearly crippled our operations, we needed a solution that could predict and prevent, not just react. Skydda's predictive heuristics have stopped three major attack attempts in six months.",
    author: "Jennifer Walsh",
    role: "HEAD OF INFRASTRUCTURE SECURITY AT RETAIL CORP",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer&backgroundColor=6B7280",
  },
  {
    id: 6,
    quote:
      "Compliance audits used to be our nightmare. Skydda automatically documents every threat detection and response action, making our SOC 2 and ISO certifications straightforward. The ROI was immediate.",
    author: "Robert Martinez",
    role: "SECURITY COMPLIANCE LEAD AT DATASTREAM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&backgroundColor=7C3AED",
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
              {"What Security Leaders Say About Skydda.".split(" ").map((word, i) => (
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
