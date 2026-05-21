"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { formatNumber } from "@/lib/utils";

export default function HeroSection({ heroSlides = [], counters = [] }) {
  console.log("HeroSection heroSlides prop:", heroSlides);
  console.log("First slide image:", heroSlides[0]?.image);
  return (
    <section className="relative pt-10 md:pt-14">
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />

      <div className="glass-panel overflow-hidden rounded-[28px] p-6 md:p-10">
        <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4500, disableOnInteraction: false }} loop pagination={{ clickable: true }} className="hero-swiper">
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="grid min-h-[440px] items-center gap-10 lg:grid-cols-2">
                <div className="space-y-6">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-main font-space text-4xl leading-tight md:text-6xl">
                    {slide.title}
                  </motion.h1>
                  <p className="text-subtle max-w-xl text-base leading-relaxed md:text-lg">{slide.subtitle}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/ideas" className="btn-primary">
                      Explore Ideas
                    </Link>
                    <Link href="/add-idea" className="btn-secondary">
                      Start Sharing
                    </Link>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[26px]">
                  {/* Image */}
                  <img src={slide.image || "/Assets/Skill-Based-Education.png"} alt={slide.label || "slide image"} className="absolute inset-0 h-full w-full object-cover" />

                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/75 to-transparent" />

                  {/* Content Container */}
                  <div className="relative flex h-[240px] flex-col items-center justify-center px-4 py-6 text-center md:h-[280px] lg:h-[320px]">
                    {slide.label && <p className="text-xs uppercase tracking-[.2em] text-cyan-400">{slide.label}</p>}

                    {slide.description && <h3 className="text-white mt-2 font-space text-2xl font-semibold md:text-3xl">{slide.description}</h3>}

                    <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {counters.map((item) => (
          <div key={item.label} className="surface-card rounded-2xl p-4">
            <p className="text-main font-space text-3xl font-semibold">{formatNumber(item.value)}+</p>
            <p className="text-muted mt-1 text-xs uppercase tracking-[.15em]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
