"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function CtaSection() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard")
    } else {
      router.push("/auth/sign-in")
    }
  }
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h2 className="text-balance text-4xl font-normal tracking-tight text-white md:text-5xl lg:text-6xl">
            {"Plan with confidence. Execute with clarity.".split(" ").map((word, i) => (
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
          <p className="text-balance mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            SceneGuard surfaces production challenges before they impact your timeline or budget. Start analyzing scenes today and bring smarter planning to your production.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-white px-8 text-black hover:bg-white/90"
            onClick={handleGetStarted}
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </section>
  );
}
