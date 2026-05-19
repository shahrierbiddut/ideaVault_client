import PageTransition from "@/components/common/PageTransition";
import HomeContentSections from "@/components/home/HomeContentSections";

export const metadata = {
    title: "IdeaVault | Startup Idea Sharing Platform",
    description: "Share startup ideas, validate concepts, and collaborate with innovators.",
};

export default function HomePage() {
    return (
        <PageTransition>
            <HomeContentSections />
        </PageTransition>
    );
}