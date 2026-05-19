import PageTransition from "@/components/common/PageTransition";
import SectionHeading from "@/components/common/SectionHeading";
import IdeasGrid from "@/components/ideas/IdeasGrid";

export const metadata = {
    title: "Ideas | IdeaVault",
    description: "Discover and explore innovative startup ideas.",
};

export default function IdeasPage() {
    return (
        <PageTransition>
            <section className="space-y-8 py-10">
                <SectionHeading
                    eyebrow="Explore"
                    title="Browse ideas"
                    subtitle="Browse startup concepts with search, filters, sorting, and live backend data."
                />
                <IdeasGrid />
            </section>
        </PageTransition>
    );
}