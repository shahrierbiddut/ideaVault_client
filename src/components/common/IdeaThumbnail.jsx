"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { getIdeaImageCandidates } from "@/lib/ideaImages";

export default function IdeaThumbnail({ title, imageURL, className, sizes = "(max-width: 768px) 100vw, 33vw", priority = false }) {
  const candidates = useMemo(() => getIdeaImageCandidates({ title, imageURL }), [title, imageURL]);
  const [index, setIndex] = useState(0);

  const src = candidates[index] || candidates[candidates.length - 1];

  return (
    <div className={className}>
      <Image
        src={src}
        alt={title || "Idea image"}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="object-cover"
        onError={() => {
          setIndex((prev) => {
            if (prev >= candidates.length - 1) return prev;
            return prev + 1;
          });
        }}
      />
    </div>
  );
}
