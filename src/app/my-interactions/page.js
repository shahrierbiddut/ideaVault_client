import PageTransition from "@/components/common/PageTransition";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import InteractionsTimeline from "@/components/dashboard/InteractionsTimeline";

export const metadata = {
    title: "My Interactions | IdeaVault",
    description: "Track comments, bookmarks, and engagement activity.",
};

export default function MyInteractionsPage() {
    return (
        <ProtectedRoute>
            <PageTransition>
                <section className="py-8 sm:py-10">
                    <InteractionsTimeline />
                </section>
            </PageTransition>
        </ProtectedRoute>
    );
}