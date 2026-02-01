"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "1",
    question: "How does Aegis Core differ from traditional firewalls?",
    answer:
      "Traditional firewalls rely on static rules and signature-based detection, which can't keep pace with modern AI-driven attacks. Aegis Core uses autonomous machine learning to predict and neutralize zero-day threats in real-time, learning your network's unique patterns and adapting without manual updates or human intervention.",
  },
  {
    id: "2",
    question: "What is the typical deployment timeline?",
    answer:
      "Most organizations can deploy Skydda in under 48 hours. Our autonomous system learns your network baseline within 3-5 days and reaches full operational capacity within two weeks. Unlike legacy solutions that take months to configure, Aegis Core self-optimizes as it learns your environment.",
  },
  {
    id: "3",
    question: "Does Skydda integrate with existing security infrastructure?",
    answer:
      "Yes. Skydda seamlessly integrates with your existing SIEM, SOC tools, and security stack. Our API-first architecture allows bidirectional data flow with platforms like Splunk, CrowdStrike, and Palo Alto Networks, enhancing your current investments rather than replacing them.",
  },
  {
    id: "4",
    question: "What kind of threats can Aegis Core detect?",
    answer:
      "Aegis Core detects and neutralizes zero-day exploits, advanced persistent threats (APTs), ransomware, credential stuffing, DDoS attacks, and insider threats. Our predictive heuristics analyze 10,000+ attack vectors per second to identify threats before they breach your perimeter.",
  },
  {
    id: "5",
    question: "Do you offer compliance support and reporting?",
    answer:
      "Absolutely. Skydda automatically generates compliance reports for SOC 2, ISO 27001, GDPR, HIPAA, and PCI DSS. Every threat detection and response is documented with full audit trails, making compliance audits straightforward and reducing your team's workload significantly.",
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleQuestion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="w-full bg-zinc-900 py-24 md:py-32 border-b border-zinc-700/30"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Header */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit">
              <div className="w-2.5 h-2.5 bg-amber-500" />
              <span className="text-sm font-medium text-zinc-400 tracking-wide">
                FAQ
              </span>
            </div>
            
            <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1]">
              {"Common Questions".split(" ").map((word, i) => (
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

            <p className="text-balance text-base md:text-lg text-zinc-400 leading-relaxed max-w-md">
              Get quick answers about Skydda's AI-powered security platform and
              how autonomous threat detection protects your organization. Can't
              find what you're looking for? Reach out below.
            </p>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="flex flex-col">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={cn(
                  "border-t border-zinc-700/30",
                  index === faqs.length - 1 && "border-b"
                )}
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full py-6 flex items-center justify-between gap-4 text-left group"
                >
                  <span className="text-lg md:text-xl font-normal text-white group-hover:text-zinc-300 transition-colors">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pr-12">
                        <p className="text-base leading-relaxed text-zinc-400">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
