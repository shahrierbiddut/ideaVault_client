import { Inter, Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "IdeaVault | Startup Idea Sharing Platform",
    template: "%s",
  },
  description: "A premium startup idea sharing platform for innovators and creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${poppins.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-base text-body flex flex-col">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
