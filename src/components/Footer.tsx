import { Mail, Phone, MapPin, Github, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { useCV } from "@/contexts/CVContext";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z"/>
  </svg>
);

const Footer = () => {
  const { cv } = useCV();

  const socialLinks = [
    { key: "github", icon: Github, url: cv.socialLinks?.github, label: "GitHub" },
    { key: "linkedin", icon: Linkedin, url: cv.socialLinks?.linkedin, label: "LinkedIn" },
    { key: "instagram", icon: Instagram, url: cv.socialLinks?.instagram, label: "Instagram" },
    { key: "whatsapp", icon: MessageCircle, url: cv.socialLinks?.whatsapp, label: "WhatsApp" },
    { key: "tiktok", icon: TikTokIcon, url: cv.socialLinks?.tiktok, label: "TikTok" },
  ].filter(l => l.url);

  return (
    <footer className="bg-foreground text-background py-12 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Davood Sharifi</h3>
            <p className="text-sm opacity-70">Software Developer & Creative Designer based in Braga, Portugal.</p>
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socialLinks.map((s) => (
                  <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                    title={s.label}>
                    {s.key === "tiktok" ? <TikTokIcon /> : <s.icon size={16} />}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3 opacity-80">Contact</h4>
            <div className="space-y-2 text-sm opacity-70">
              <div className="flex items-center gap-2"><Phone size={14} /> {cv.phone}</div>
              <div className="flex items-center gap-2"><Mail size={14} /> {cv.email}</div>
              <div className="flex items-center gap-2"><MapPin size={14} /> {cv.location}</div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3 opacity-80">Quick Links</h4>
            <div className="space-y-2 text-sm opacity-70">
              <a href="/" className="block hover:opacity-100 transition-opacity">My CV</a>
              <a href="/shop" className="block hover:opacity-100 transition-opacity">Shop</a>
              <a href="/chat" className="block hover:opacity-100 transition-opacity">Chat</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-background/10 text-center text-sm opacity-50">
          © {new Date().getFullYear()} Davood Sharifi. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
