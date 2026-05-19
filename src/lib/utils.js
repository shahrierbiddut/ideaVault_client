export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function formatNumber(value) {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
}

export function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}