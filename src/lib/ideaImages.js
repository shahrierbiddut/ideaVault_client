const ASSET_IMAGE_FILES = [
    "Ai-Health-Assistant-pro.jpeg",
    "Open-Ai--scaled.jpg",
    "Skill-Based-Education.png",
    "smart-waste-tracker.webp",
    "Smart-Water-Bottle.jpg",
    "Urban-Farmer.webp",
];

const FALLBACK_IMAGE = "/Assets/Open-Ai--scaled.jpg";
const ALLOWED_REMOTE_HOSTS = new Set([
    "i.ibb.co",
    "images.unsplash.com",
    "lh3.googleusercontent.com",
    "api.dicebear.com",
]);

function normalizeRemoteImageUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";

    // Common typo observed in incoming API payloads.
    const corrected = raw.replace("https://i.ibb.co.com/", "https://i.ibb.co/");

    try {
        const parsed = new URL(corrected);
        if (!ALLOWED_REMOTE_HOSTS.has(parsed.hostname)) return "";
        return parsed.toString();
    } catch {
        return "";
    }
}

function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function compact(value) {
    return normalize(value).replace(/\s+/g, "");
}

function tokens(value) {
    return normalize(value)
        .split(" ")
        .filter((token) => token.length > 1);
}

function scoreFileAgainstTitle(fileName, title) {
    const fileBase = fileName.replace(/\.[a-z0-9]+$/i, "");
    const fileCompact = compact(fileBase);
    const titleCompact = compact(title);
    const titleTokens = tokens(title);

    if (!titleCompact) return 0;

    let score = 0;

    if (fileCompact === titleCompact) score += 120;
    if (fileCompact.includes(titleCompact) || titleCompact.includes(fileCompact)) score += 80;

    for (const token of titleTokens) {
        if (fileCompact.includes(token)) score += 10;
    }

    return score;
}

export function getIdeaImageCandidates({ title, imageURL }) {
    const candidates = [];

    const normalizedRemote = normalizeRemoteImageUrl(imageURL);
    if (normalizedRemote) {
        candidates.push(normalizedRemote);
    }

    const rankedLocal = ASSET_IMAGE_FILES
        .map((file) => ({ file, score: scoreFileAgainstTitle(file, title) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => `/Assets/${item.file}`);

    candidates.push(...rankedLocal);

    // Ensure all known assets can still be attempted if title matching is weak.
    for (const file of ASSET_IMAGE_FILES) {
        const path = `/Assets/${file}`;
        if (!candidates.includes(path)) {
            candidates.push(path);
        }
    }

    if (!candidates.includes(FALLBACK_IMAGE)) {
        candidates.push(FALLBACK_IMAGE);
    }

    return candidates;
}