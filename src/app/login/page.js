import PageTransition from "@/components/common/PageTransition";
import AuthCard from "@/components/forms/AuthCard";

export const metadata = {
  title: "Login | IdeaVault",
  description: "Access your IdeaVault account.",
};

export default function LoginPage() {
  return (
    <PageTransition>
      <AuthCard mode="login" />
    </PageTransition>
  );
}
