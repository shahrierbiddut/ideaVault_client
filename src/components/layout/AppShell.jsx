import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AppShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-[min(1180px,92%)] flex-1 px-(--safe-left) pr-(--safe-right)">{children}</main>
      <Footer />
    </>
  );
}
