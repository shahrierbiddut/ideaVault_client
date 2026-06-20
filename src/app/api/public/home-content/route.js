const PUBLIC_HOME_PATH = "/public/home-content";

const getUpstreamUrl = () => {
    const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://ideavaultserver.vercel.app/api";
    const normalizedBase = rawBaseUrl.replace(/\/$/, "");
    return `${normalizedBase}${PUBLIC_HOME_PATH}`;
};

export async function GET() {
    try {
        const upstreamUrl = getUpstreamUrl();
        const response = await fetch(upstreamUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const contentType = response.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        const body = isJson
            ? await response.json()
            : { success: false, error: await response.text() };

        return Response.json(body, { status: response.status });
    } catch (error) {
        return Response.json(
            {
                success: false,
                error: "Unable to load home content from upstream API",
                message: error?.message || "Network error",
            },
            { status: 502 }
        );
    }
}
