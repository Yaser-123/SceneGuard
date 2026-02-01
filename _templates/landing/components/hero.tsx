"use client"

import { Button } from "@/components/ui/button"
import { Film, Menu, X, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      />
      
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-slate-950/20" />
      
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Film className="h-5 w-5 text-amber-500" />
              <span className="font-medium">SceneGuard</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
              <Link href="#" className="transition-colors hover:text-white">
                About
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Features
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Testimonials
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Pricing
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                FAQ
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="hidden text-sm font-medium text-white transition-colors hover:text-white/80 lg:block"
              >
                Get Started
              </Link>
              
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute left-0 right-0 top-full bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-700/30 lg:hidden">
              <div className="flex flex-col px-6 py-6 gap-4">
                <Link
                  href="#"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link
                  href="#"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="#"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  href="#"
                  className="mt-2 text-white font-medium py-2 border-t border-zinc-700/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Content - Positioned in upper portion */}
        <div className="flex flex-1 flex-col items-center px-6 pt-16 text-center md:pt-24">
          <h1 className="max-w-3xl text-balance text-5xl font-normal tracking-tight text-white md:text-6xl lg:text-7xl">
            {"Anticipate Production Risks Before the Camera Rolls".split(" ").map((word, i) => (
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
          </h1>
          
          <p className="mt-6 max-w-xl text-balance text-center text-sm leading-relaxed text-white/70 md:text-base">
            SceneGuard analyzes film scenes during pre-production to identify feasibility challenges, cost drivers, weather risks, and execution complexity—helping production teams plan smarter and avoid costly surprises.
          </p>

          {/* CTAs - Two buttons side by side */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white px-6 text-slate-900 hover:bg-white/90"
            >
              Analyze a Scene
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
            >
              View Command Center
            </Button>
          </div>
        </div>

        {/* Scroll Indicator - At bottom */}
        
      </div>
    </section>
  )
}
