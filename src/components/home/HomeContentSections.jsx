"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import TrendingIdeasSection from "@/components/home/TrendingIdeasSection";
import WhySection from "@/components/home/WhySection";
import SuccessStoriesSection from "@/components/home/SuccessStoriesSection";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import apiClient from "@/lib/apiClient";

export default function HomeContentSections() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadHomeContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get("/public/home-content");
        const data = response?.data?.data;

        if (!mounted) return;

        if (!data) {
          throw new Error("No data received from server");
        }

        setContent(data);
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Failed to load home content");
          console.error("Error loading home content:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadHomeContent();
    return () => {
      mounted = false;
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-red-500">Failed to load content</p>
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-cyan-500 px-6 py-2 text-white hover:bg-cyan-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render with server data
  return (
    <>
      <HeroSection 
        heroSlides={content?.heroSlides || []} 
        counters={content?.counters || []} 
      />
      <TrendingIdeasSection compact />
      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <WhySection whyItems={content?.whyItems || []} compact className="mt-0" />
        <SuccessStoriesSection stories={content?.stories || []} compact className="mt-0" />
      </section>
    </>
  );
}
