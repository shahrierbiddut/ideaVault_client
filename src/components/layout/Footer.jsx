import Link from "next/link";
import {
  FiMail,
  FiMapPin,
  FiPhoneCall,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const brandLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook", className: "bg-[#1877F2]" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn", className: "bg-[#0A66C2]" },
  { icon: FaInstagram, href: "#", label: "Instagram", className: "bg-[#E4405F]" },
  { icon: FaXTwitter, href: "#", label: "X", className: "bg-slate-800" },
];

const footerBlocks = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Ideas", href: "/ideas" },
      { label: "Add Idea", href: "/add-idea" },
      { label: "My Ideas", href: "/my-ideas" },
      { label: "My Interactions", href: "/my-interactions" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Tech", href: "#" },
      { label: "Health", href: "#" },
      { label: "AI", href: "#" },
      { label: "Education", href: "#" },
      { label: "Environment", href: "#" },
      { label: "Social", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About Us", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Guidelines", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 pb-6">
      <div className="surface-elevated mx-auto w-[min(1180px,92%)] overflow-hidden rounded-2xl">
        <div className="grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1.1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-white">
                Q
              </span>
              <h3 className="font-space text-main text-3xl font-semibold">IdeaVault</h3>
            </div>
            <p className="text-subtle max-w-sm text-sm leading-relaxed">
              A platform for innovators to share ideas, collaborate and build the future together.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {brandLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-sm text-white transition hover:scale-105 ${item.className}`}
                  >
                    <Icon />
                  </Link>
                );
              })}
            </div>
          </div>

          {footerBlocks.map((block) => (
            <div key={block.title} className="space-y-3">
              <h4 className="font-space text-main text-lg font-semibold">{block.title}</h4>
              <ul className="text-subtle space-y-2 text-sm">
                {block.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-cyan-500">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-3">
            <h4 className="font-space text-main text-lg font-semibold">Contact</h4>
            <ul className="text-subtle space-y-3 text-sm">
              <li className="inline-flex items-center gap-2">
                <FiMail className="text-cyan-500" />
                <span>shahrierhossainbiddut@gmail.com</span>
              </li>
              <li className="inline-flex items-center gap-2">
                <FiPhoneCall className="text-cyan-500" />
                <span>+880 1234 567890</span>
              </li>
              <li className="inline-flex items-center gap-2">
                <FiMapPin className="text-cyan-500" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="theme-divider text-muted border-t px-6 py-4 text-center text-sm md:px-8">
          © 2026 IdeaVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
