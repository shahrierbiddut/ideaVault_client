import PageTransition from "@/components/common/PageTransition";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SectionHeading from "@/components/common/SectionHeading";
import AddIdeaWizard from "@/components/forms/AddIdeaWizard";

export const metadata = {
  title: "Add Idea | IdeaVault",
  description: "Submit your startup concept through a premium multi-step form.",
};

export default function AddIdeaPage() {
  return (
    <ProtectedRoute>
      <PageTransition>
        <section className="space-y-6 py-10">
          <SectionHeading
            eyebrow="Private"
            title="Submit your startup idea"
            subtitle="Use the guided multi-step flow to publish a complete and compelling idea profile."
          />
          <AddIdeaWizard />
        </section>
      </PageTransition>
    </ProtectedRoute>
  );
}
