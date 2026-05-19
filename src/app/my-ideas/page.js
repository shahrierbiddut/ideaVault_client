import PageTransition from "@/components/common/PageTransition";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SectionHeading from "@/components/common/SectionHeading";
import MyIdeasBoard from "@/components/dashboard/MyIdeasBoard";

export const metadata = {
  title: "My Ideas | IdeaVault",
  description: "Manage your published ideas in card and table views.",
};

export default function MyIdeasPage() {
  return (
    <ProtectedRoute>
      <PageTransition>
        <section className="space-y-6 py-10">
          <SectionHeading
            eyebrow="Private Dashboard"
            title="Your ideas"
            subtitle="Switch views, keep your ideas organized, and manage updates with confidence."
          />
          <MyIdeasBoard />
        </section>
      </PageTransition>
    </ProtectedRoute>
  );
}
