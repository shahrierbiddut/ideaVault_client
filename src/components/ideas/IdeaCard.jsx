import Link from "next/link";
import { FiMessageCircle, FiThumbsUp } from "react-icons/fi";
import { formatDate, formatNumber } from "@/lib/utils";
import IdeaThumbnail from "@/components/common/IdeaThumbnail";

export default function IdeaCard({ idea }) {
  const id = idea.id || idea._id;
  const author = idea.author || idea.creatorName || "Unknown";
  const postedDate = idea.postedAt || idea.createdAt;
  const likes = idea.likes ?? idea.likesCount ?? 0;
  const comments = idea.comments ?? idea.commentsCount ?? 0;

  return (
    <article className="surface-card group relative flex h-full flex-col overflow-hidden rounded-2xl p-3 transition hover:-translate-y-1 hover:border-violet-300/45">
      <IdeaThumbnail
        title={idea.title}
        imageURL={idea.imageURL}
        className="relative h-40 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/40 to-cyan-500/30"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />
      <div className="flex flex-1 flex-col p-2">
        <div className="mt-3 flex items-center justify-between gap-2">
          <h3 className="text-main font-space text-lg font-semibold">{idea.title}</h3>
          <span className="tag-chip">
            {idea.category}
          </span>
        </div>
        <p className="text-subtle mt-2 line-clamp-2 text-sm">{idea.shortDescription}</p>
        <p className="text-muted mt-4 text-xs">
          By {author} • {formatDate(postedDate)}
        </p>
        <div className="text-subtle mt-3 flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <FiThumbsUp /> {formatNumber(likes)}
          </span>
          <span className="inline-flex items-center gap-1">
            <FiMessageCircle /> {formatNumber(comments)}
          </span>
        </div>
        <Link href={`/ideas/${id}`} className="btn-primary mt-4 w-full justify-center text-center">
          View Details
        </Link>
      </div>
    </article>
  );
}
