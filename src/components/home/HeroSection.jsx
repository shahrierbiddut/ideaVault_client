"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { formatNumber } from "@/lib/utils";

export default function HeroSection({ heroSlides = [], counters = [] }) {
  return (
    <section className="relative pt-10 md:pt-14">
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />

      <div className="glass-panel overflow-hidden rounded-[28px] p-6 md:p-10">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          className="hero-swiper"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="grid min-h-[440px] items-center gap-10 lg:grid-cols-2">
                <div className="space-y-6">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-main font-space text-4xl leading-tight md:text-6xl"
                  >
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
                  className="relative mx-auto h-[320px] w-full max-w-[440px]"
                >
                  <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-violet-500/50 via-blue-500/30 to-cyan-400/35 blur-3xl" />
                  <div className="surface-card relative h-full rounded-[26px] p-6">
                    <div className="grid h-full place-items-center rounded-2xl border border-dashed border-violet-300/35 bg-gradient-to-br from-violet-500/20 to-cyan-400/15 text-center">
                      <div>
                        <p className="text-xs uppercase tracking-[.2em] text-violet-500">Live Signal</p>
                        <h3 className="text-main mt-2 font-space text-3xl font-semibold">Innovation Radar</h3>
                        <p className="text-subtle mt-2 text-sm">Trending concepts validated by real founder feedback.</p>
                      </div>
                    </div>
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
