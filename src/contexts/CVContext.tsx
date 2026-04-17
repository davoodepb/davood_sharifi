import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface CVData {
  name: string;
  title: string;
  about: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  location: string;
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    whatsapp: string;
    tiktok: string;
  };
  education: { period: string; degree: string; school: string; details: string[] }[];
  experience: { year: string; title: string; desc: string }[];
  technicalSkills: { name: string; pct: number }[];
  creativeSkills: { name: string; pct: number }[];
  languages: { name: string; pct: number; level: string }[];
}

const defaultCV: CVData = {
  name: "Davood Sharifi",
  title: "Software Developer & Creative Designer",
  about: "I'm a 19-year-old passionate software developer and creative designer. I practice various sports including gym workouts, swimming, ping-pong, tennis, and volleyball. I am a disciplined and energetic person, always looking for opportunities to grow both personally and professionally. I combine technical skills with creative vision to deliver compelling digital experiences.",
  phone: "+351 927 717 490",
  email: "davood00351@gmail.com",
  address: "Rua do Raio, nº 75, Braga",
  dob: "22/05/2006",
  location: "Braga, Portugal",
  socialLinks: {
    github: "https://github.com/davoodepb",
    linkedin: "https://www.linkedin.com/in/davood-sharifi-a801743b9",
    instagram: "",
    whatsapp: "https://wa.me/351927717490",
    tiktok: "",
  },
  education: [
    {
      period: "2018 – 2022",
      degree: "Bachelor's in Computer Science / Software Engineering",
      school: "University of Minho, Braga",
      details: [
        "Software development (React, JavaScript)",
        "Database management (SQL, Firebase)",
        "Cloud computing (GCP, Vercel)",
        "Algorithms & Data Structures",
        "Version control (Git, GitHub)",
      ],
    },
    {
      period: "2023 – 2026",
      degree: "Professional School",
      school: "Braga Professional School",
      details: ["Currently in 12th Grade"],
    },
  ],
  experience: [
    { year: "2022 – Present", title: "Software Developer (Freelance)", desc: "Web app development with React & JavaScript. Cloud infrastructure, database design, OAuth integration, e-commerce platforms." },
    { year: "2025", title: "Retail Trainee – Worten", desc: "Hands-on experience in retail operations, customer service, and team collaboration in electronics retail." },
    { year: "2025", title: "YouTube Content Creator", desc: "Founded and manage a YouTube channel producing original comedic short-form content." },
    { year: "2023", title: "Event Organizer", desc: "Organized football matches, coordinated team events, scheduling, and venue management." },
    { year: "2021", title: "Brand Content Creator", desc: "Full-service content creation: photography, videography, graphic design, motion graphics, and music production." },
    { year: "2020", title: "YouTube Video Editor", desc: "Creating and editing YouTube videos, designing logos and thumbnails." },
  ],
  technicalSkills: [
    { name: "Web & App Development", pct: 85 },
    { name: "JavaScript / React", pct: 85 },
    { name: "SQL / Database", pct: 75 },
    { name: "Git / GitHub", pct: 80 },
    { name: "Cloud (GCP, Vercel)", pct: 70 },
    { name: "Technical SEO", pct: 75 },
  ],
  creativeSkills: [
    { name: "Graphic Design", pct: 90 },
    { name: "Motion Graphics", pct: 80 },
    { name: "Photography & Video", pct: 85 },
    { name: "Interior/Exterior Design", pct: 70 },
    { name: "Audio / Music Production", pct: 75 },
  ],
  languages: [
    { name: "Persian", pct: 100, level: "Native" },
    { name: "Portuguese", pct: 90, level: "Fluent" },
    { name: "English", pct: 60, level: "Intermediate" },
  ],
};

const CV_DOC_PATH = "settings/cv";

interface CVContextType {
  cv: CVData;
  updateCV: (updates: Partial<CVData>) => void;
  saveToFirestore: () => Promise<void>;
  loading: boolean;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cv, setCV] = useState<CVData>(defaultCV);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCV = async () => {
      try {
        const snap = await getDoc(doc(db, CV_DOC_PATH));
        if (snap.exists()) {
          setCV({ ...defaultCV, ...snap.data() } as CVData);
        }
      } catch (e) {
        console.log("Using default CV data (Firestore not available yet)");
      } finally {
        setLoading(false);
      }
    };
    loadCV();
  }, []);

  const updateCV = (updates: Partial<CVData>) => {
    setCV((prev) => {
      const updated = { ...prev, ...updates };
      // Auto-save to Firestore
      setDoc(doc(db, CV_DOC_PATH), updated).catch(() => {
        console.log("Auto-save to Firestore failed, data saved locally");
      });
      return updated;
    });
  };

  const saveToFirestore = async () => {
    await setDoc(doc(db, CV_DOC_PATH), cv);
  };

  return (
    <CVContext.Provider value={{ cv, updateCV, saveToFirestore, loading }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error("useCV must be used within CVProvider");
  return ctx;
};
