import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Globe, CheckCircle, Github, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import profileImg from "@/assets/profile.jpg";
import euFlag from "@/assets/eu-flag.png";
import jsPDF from "jspdf";
import { useCV } from "@/contexts/CVContext";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z"/>
  </svg>
);

const Index = () => {
  const cvRef = useRef<HTMLDivElement>(null);
  const { cv } = useCV();
  const navigate = useNavigate();

  // Secret admin access: tap profile 5 times
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleProfileTap = useCallback(() => {
    setTapCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        navigate("/admin-panel-secret");
        return 0;
      }
      return next;
    });
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setTapCount(0), 2000);
  }, [navigate]);

  const socialLinks = [
    { key: "github", icon: Github, url: cv.socialLinks?.github, label: "GitHub" },
    { key: "linkedin", icon: Linkedin, url: cv.socialLinks?.linkedin, label: "LinkedIn" },
    { key: "instagram", icon: Instagram, url: cv.socialLinks?.instagram, label: "Instagram" },
    { key: "whatsapp", icon: MessageCircle, url: cv.socialLinks?.whatsapp, label: "WhatsApp" },
    { key: "tiktok", icon: TikTokIcon, url: cv.socialLinks?.tiktok, label: "TikTok" },
  ].filter(l => l.url);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pageW - margin * 2;
    let y = margin;

    const checkPage = (needed: number) => {
      if (y + needed > pageH - margin) {
        pdf.addPage();
        y = margin;
      }
    };

    // --- HEADER with blue background ---
    pdf.setFillColor(37, 99, 235); // primary blue
    pdf.rect(0, 0, pageW, 52, "F");

    // EU flag text + Europass
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.text("★ Europass", margin, 10);

    // Name
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(255, 255, 255);
    pdf.text(cv.name, margin, 25);

    // Title
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(220, 230, 255);
    pdf.text(cv.title, margin, 33);

    // Contact line
    pdf.setFontSize(8);
    pdf.setTextColor(200, 215, 255);
    const contactLine = `${cv.location}  |  ${cv.phone}  |  ${cv.email}`;
    pdf.text(contactLine, margin, 41);

    // Social links line
    const socials: string[] = [];
    if (cv.socialLinks?.github) socials.push(`GitHub: ${cv.socialLinks.github}`);
    if (cv.socialLinks?.linkedin) socials.push(`LinkedIn: ${cv.socialLinks.linkedin}`);
    if (cv.socialLinks?.whatsapp) socials.push(`WhatsApp: ${cv.socialLinks.whatsapp}`);
    if (socials.length > 0) {
      pdf.setFontSize(7);
      pdf.text(socials.join("  |  "), margin, 48);
    }

    y = 60;

    // Helper: section title
    const sectionTitle = (title: string) => {
      checkPage(12);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(37, 99, 235);
      pdf.text(title, margin, y);
      y += 2;
      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageW - margin, y);
      y += 6;
    };

    // Helper: wrapped text
    const addText = (text: string, fontSize: number, color: [number, number, number], bold = false, indent = 0) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text, contentW - indent);
      checkPage(lines.length * (fontSize * 0.4 + 1));
      pdf.text(lines, margin + indent, y);
      y += lines.length * (fontSize * 0.4 + 1);
    };

    // --- ABOUT ME ---
    sectionTitle("About Me");
    addText(cv.about, 9, [60, 60, 80]);
    y += 4;

    // --- EDUCATION ---
    sectionTitle("Education");
    cv.education.forEach((edu) => {
      checkPage(20);
      addText(edu.period, 8, [120, 120, 140]);
      addText(edu.degree, 10, [30, 30, 50], true);
      addText(edu.school, 9, [37, 99, 235]);
      edu.details.forEach((d) => {
        addText(`• ${d}`, 8, [80, 80, 100], false, 4);
      });
      y += 3;
    });

    // --- EXPERIENCE ---
    sectionTitle("Work Experience");
    cv.experience.forEach((exp) => {
      checkPage(15);
      addText(exp.year, 8, [120, 120, 140]);
      addText(exp.title, 10, [30, 30, 50], true);
      addText(exp.desc, 8, [80, 80, 100], false, 4);
      y += 3;
    });

    // --- SKILLS ---
    sectionTitle("Skills");

    const drawSkillBars = (title: string, skills: { name: string; pct: number }[], startX: number, barW: number) => {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 30, 50);
      const savedY = y;
      pdf.text(title, startX, y);
      let localY = y + 5;

      skills.forEach((s) => {
        if (localY > pageH - margin - 10) return; // skip if no space
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 80);
        pdf.text(s.name, startX, localY);
        pdf.text(`${s.pct}%`, startX + barW - 2, localY, { align: "right" });
        localY += 3;
        // Track
        pdf.setFillColor(230, 230, 240);
        pdf.roundedRect(startX, localY, barW, 2.5, 1, 1, "F");
        // Fill
        pdf.setFillColor(37, 99, 235);
        pdf.roundedRect(startX, localY, barW * (s.pct / 100), 2.5, 1, 1, "F");
        localY += 6;
      });
      return localY;
    };

    const colW = (contentW - 8) / 3;
    checkPage(50);
    const y1 = drawSkillBars("Technical", cv.technicalSkills, margin, colW);
    const y2 = drawSkillBars("Creative", cv.creativeSkills, margin + colW + 4, colW);
    const y3 = drawSkillBars("Languages", cv.languages.map(l => ({ name: `${l.name} (${l.level})`, pct: l.pct })), margin + (colW + 4) * 2, colW);
    y = Math.max(y1 || y, y2 || y, y3 || y) + 4;

    // --- CONTACT INFO ---
    sectionTitle("Contact Information");
    checkPage(20);
    const contacts = [
      { label: "Phone", value: cv.phone },
      { label: "Email", value: cv.email },
      { label: "Address", value: cv.address },
      { label: "Date of Birth", value: cv.dob },
      { label: "Location", value: cv.location },
    ];
    contacts.forEach((c) => {
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 30, 50);
      pdf.text(`${c.label}:`, margin, y);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 80);
      pdf.text(c.value, margin + 30, y);
      y += 5;
    });

    // Footer
    pdf.setFontSize(7);
    pdf.setTextColor(160, 160, 180);
    pdf.text(`Generated on ${new Date().toLocaleDateString("en-GB")} — Europass CV`, margin, pageH - 8);

    pdf.save("Davood_Sharifi_CV.pdf");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div id="cv-printable">
        {/* Hero */}
        <section className="hero-gradient pt-24 pb-16 md:pb-24 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <img src={euFlag} alt="European Union Flag" className="w-10 h-10 object-contain" />
              <span className="text-primary-foreground/90 text-xl font-heading font-bold tracking-wide">Europass</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div 
                className="relative w-40 h-40 md:w-52 md:h-52 flex-shrink-0 flex items-center justify-center cursor-pointer select-none"
                onClick={handleProfileTap}
              >
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30) * (Math.PI / 180);
                    const radius = 48;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    return (
                      <span key={i} className="absolute text-yellow-400 text-[10px] md:text-xs"
                        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                        ★
                      </span>
                    );
                  })}
                </div>
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary-foreground/30 shadow-xl z-10">
                  <img src={profileImg} alt={cv.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-2">
                  {cv.name}
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/80 mb-4">{cv.title}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {cv.location}</span>
                  <span className="flex items-center gap-1"><Phone size={14} /> {cv.phone}</span>
                  <span className="flex items-center gap-1"><Mail size={14} /> {cv.email}</span>
                </div>
                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                    {socialLinks.map((s) => (
                      <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground/90 text-xs font-medium transition-colors">
                        {s.key === "tiktok" ? <TikTokIcon /> : <s.icon size={14} />}
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
                <Button onClick={handleDownloadPDF}
                  className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold gap-2">
                  <Download size={16} /> Download CV as PDF
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CV Content */}
        <div ref={cvRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* About Me */}
          <section className="europass-section animate-fade-in">
            <h2 className="europass-heading">About Me</h2>
            <p className="text-muted-foreground leading-relaxed">{cv.about}</p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="europass-section animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="europass-heading flex items-center gap-2">
                <GraduationCap size={20} className="text-primary" /> Education
              </h2>
              <div className="space-y-6">
                {cv.education.map((edu, i) => (
                  <div key={i} className="border-l-2 border-border pl-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar size={14} /> {edu.period}
                    </div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-primary font-medium">{edu.school}</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {edu.details.map((d, j) => (<li key={j}>• {d}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="europass-section animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="europass-heading flex items-center gap-2">
                <Briefcase size={20} className="text-primary" /> Work Experience
              </h2>
              <div className="space-y-5">
                {cv.experience.map((exp, i) => (
                  <div key={i} className="border-l-2 border-border pl-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar size={14} /> {exp.year}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Skills */}
          <section className="europass-section animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="europass-heading">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" /> Technical
                </h3>
                <div className="space-y-3">
                  {cv.technicalSkills.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{s.name}</span>
                        <span className="text-muted-foreground">{s.pct}%</span>
                      </div>
                      <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: `${s.pct}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" /> Creative
                </h3>
                <div className="space-y-3">
                  {cv.creativeSkills.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{s.name}</span>
                        <span className="text-muted-foreground">{s.pct}%</span>
                      </div>
                      <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: `${s.pct}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe size={16} className="text-primary" /> Languages
                </h3>
                <div className="space-y-3">
                  {cv.languages.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{s.name}</span>
                        <span className="text-muted-foreground">{s.level}</span>
                      </div>
                      <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: `${s.pct}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="europass-section animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="europass-heading">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Phone, label: "Phone", value: cv.phone },
                { icon: Mail, label: "Email", value: cv.email },
                { icon: MapPin, label: "Address", value: cv.address },
                { icon: Calendar, label: "Date of Birth", value: cv.dob },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <c.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className="text-sm font-medium text-foreground">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center no-print">
            <Button onClick={handleDownloadPDF} className="gap-2" size="lg">
              <Download size={18} /> Download CV as PDF
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;