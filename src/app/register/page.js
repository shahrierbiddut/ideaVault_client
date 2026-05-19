import PageTransition from "@/components/common/PageTransition";
import AuthCard from "@/components/forms/AuthCard";

export const metadata = {
  title: "Register | IdeaVault",
  description: "Create your IdeaVault account and start sharing startup ideas.",
};

export default function RegisterPage() {
  return (
    <PageTransition>
      <AuthCard mode="register" />
    </PageTransition>
  );
}
