"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/common/SectionHeading";

export default function SuccessStoriesSection({ stories = [], compact = false, className }) {
  if (compact) {
    return (
      <section className={cn("surface-card space-y-4 rounded-2xl p-4", className)}>
        <h3 className="text-main font-space text-xl font-semibold">Startup Success Stories</h3>
        <div className="glass-panel rounded-2xl p-4">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
          >
            {stories.map((story) => (
              <SwiperSlide key={story.name}>
                <div className="space-y-3 text-left">
                  <p className="text-subtle text-sm leading-relaxed">“{story.quote}”</p>
                  <div>
                    <p className="text-main font-space text-base font-semibold">{story.name}</p>
                    <p className="text-xs text-cyan-500">{story.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("mt-20 space-y-8", className)}>
      <SectionHeading
        eyebrow="Success Stories"
        title="Founders building real momentum"
        subtitle="A fast snapshot of creators who transformed concepts into startup-grade execution through community insight."
      />
      <div className="glass-panel rounded-3xl p-6 md:p-10">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
        >
          {stories.map((story) => (
            <SwiperSlide key={story.name}>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-subtle text-xl leading-relaxed md:text-2xl">“{story.quote}”</p>
                <p className="text-main mt-6 font-space text-lg font-semibold">{story.name}</p>
                <p className="text-sm text-cyan-500">{story.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
