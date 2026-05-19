"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import TrendingIdeasSection from "@/components/home/TrendingIdeasSection";
import WhySection from "@/components/home/WhySection";
import SuccessStoriesSection from "@/components/home/SuccessStoriesSection";
import apiClient from "@/lib/apiClient";

const fallbackContent = {
  heroSlides: [
    {
      id: 1,
      title: "Share Ideas. Inspire Innovation. Build the Future.",
      subtitle:
        "Discover startup concepts, collaborate with creators, and turn bold ideas into investable momentum.",
    },
    {
      id: 2,
      title: "From Concept to Community Validation.",
      subtitle:
        "Publish your idea, gather intelligent feedback, and iterate with a serious founder network.",
    },
    {
      id: 3,
      title: "Where Builders Meet Their Next Breakthrough.",
      subtitle:
        "Track traction, spark conversations, and make your startup concept impossible to ignore.",
    },
  ],
  counters: [
    { label: "Ideas Shared", value: 0 },
    { label: "Active Users", value: 0 },
    { label: "Comments", value: 0 },
    { label: "Categories", value: 0 },
  ],
  whyItems: [
    {
      title: "Collaborate",
      description: "Find co-builders and domain experts ready to shape your concept.",
    },
    {
      title: "Validate",
      description: "Receive focused feedback from founders, mentors, and operators.",
    },
    {
      title: "Innovate",
      description: "Explore emerging trends and discover adjacent opportunities faster.",
    },
    {
      title: "Grow",
      description: "Build audience trust before launch with meaningful community traction.",
    },
  ],
  stories: [
    {
      name: "Arif Hossain",
      role: "Co-founder, GreenSync",
      quote:
        "IdeaVault helped us validate pricing, refine positioning, and meet our first angel mentor in two weeks.",
    },
    {
      name: "Nabila Karim",
      role: "Founder, LearnNest",
      quote:
        "The feedback loop here felt different: specific, constructive, and truly founder-friendly.",
    },
    {
      name: "Tahmid Rahman",
      role: "Builder, PulseCare",
      quote:
        "We moved from rough idea to pilot-ready roadmap using comments and interaction insights.",
    },
  ],
};

export default function HomeContentSections() {
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    let mounted = true;

    const loadHomeContent = async () => {
      try {
        const response = await apiClient.get("/public/home-content");
        const data = response?.data?.data;
        if (!mounted || !data) return;

        setContent({
          heroSlides: data.heroSlides || fallbackContent.heroSlides,
          counters: data.counters || fallbackContent.counters,
          whyItems: data.whyItems || fallbackContent.whyItems,
          stories: data.stories || fallbackContent.stories,
        });
      } catch {
        if (mounted) {
          setContent(fallbackContent);
        }
      }
    };

    loadHomeContent();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <HeroSection heroSlides={content.heroSlides} counters={content.counters} />
      <TrendingIdeasSection compact />
      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <WhySection whyItems={content.whyItems} compact className="mt-0" />
        <SuccessStoriesSection stories={content.stories} compact className="mt-0" />
      </section>
    </>
  );
}
