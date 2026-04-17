import { useState, useEffect, useRef } from "react";
import { FileText, ShoppingBag, MessageCircle, Settings, Plus, Pencil, Trash2, Save, LogIn, LogOut, Link as LinkIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useCV } from "@/contexts/CVContext";
import { useAuth } from "@/contexts/AuthContext";
import { useShop, Product } from "@/contexts/ShopContext";

type Tab = "cv" | "social" | "products" | "messages" | "settings";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "cv", label: "CV Info", icon: FileText },
  { key: "social", label: "Social Links", icon: LinkIcon },
  { key: "products", label: "Products", icon: ShoppingBag },
  { key: "messages", label: "Messages", icon: MessageCircle },
  { key: "settings", label: "Settings", icon: Settings },
];

const Admin = () => {
  const { user, loading, isAdmin, login, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("cv");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPass);
      toast.success("Logged in successfully!");
    } catch (e: any) {
      toast.error(e.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
    } catch (e: any) {
      toast.error(e.message || "Google login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 max-w-md mx-auto px-4 py-16">
          <div className="bg-card rounded-xl border border-border p-8 space-y-6">
            <div className="text-center">
              <LogIn size={40} className="mx-auto text-primary mb-4" />
              <h1 className="text-2xl font-heading font-bold text-foreground">Admin Login</h1>
              <p className="text-sm text-muted-foreground mt-2">Sign in to manage your CV and content</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <Input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="admin@email.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
                <Input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
              </div>
              <Button className="w-full gap-2" onClick={handleLogin} disabled={loginLoading}>
                <LogIn size={16} /> {loginLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={handleGoogleLogin} disabled={loginLoading}>
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign in with Google
              </Button>
              {user && !isAdmin && (
                <p className="text-sm text-destructive text-center">You are logged in but not authorized as admin.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground">Admin Panel</h1>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => { logout(); toast.success("Logged out"); }}>
            <LogOut size={16} /> Logout
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-56 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-3 space-y-1">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`admin-sidebar-item w-full ${activeTab === tab.key ? "admin-sidebar-active" : ""}`}>
                  <tab.icon size={18} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-card rounded-xl border border-border p-6">
            {activeTab === "cv" && <CVPanel />}
            {activeTab === "social" && <SocialPanel />}
            {activeTab === "products" && <ProductsPanel />}
            {activeTab === "messages" && <MessagesPanel />}
            {activeTab === "settings" && <SettingsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

const CVPanel = () => {
  const { cv, updateCV, saveToFirestore } = useCV();
  const [name, setName] = useState(cv.name);
  const [title, setTitle] = useState(cv.title);
  const [about, setAbout] = useState(cv.about);
  const [phone, setPhone] = useState(cv.phone);
  const [email, setEmail] = useState(cv.email);
  const [address, setAddress] = useState(cv.address);
  const [location, setLocation] = useState(cv.location);
  const [dob, setDob] = useState(cv.dob);
  const [education, setEducation] = useState(cv.education);
  const [experience, setExperience] = useState(cv.experience);
  const [technicalSkills, setTechnicalSkills] = useState(cv.technicalSkills);
  const [creativeSkills, setCreativeSkills] = useState(cv.creativeSkills);
  const [languages, setLanguages] = useState(cv.languages);

  const handleSave = async () => {
    updateCV({ name, title, about, phone, email, address, location, dob, education, experience, technicalSkills, creativeSkills, languages });
    try {
      await saveToFirestore();
      toast.success("CV saved to Firebase! Changes are live.");
    } catch {
      toast.success("CV updated locally.");
    }
  };

  // Education helpers
  const updateEdu = (i: number, field: string, val: string) => {
    const copy = [...education];
    (copy[i] as any)[field] = val;
    setEducation(copy);
  };
  const updateEduDetail = (i: number, di: number, val: string) => {
    const copy = [...education];
    copy[i].details[di] = val;
    setEducation(copy);
  };
  const addEduDetail = (i: number) => {
    const copy = [...education];
    copy[i].details.push("");
    setEducation(copy);
  };
  const removeEduDetail = (i: number, di: number) => {
    const copy = [...education];
    copy[i].details.splice(di, 1);
    setEducation(copy);
  };
  const addEducation = () => setEducation([...education, { period: "", degree: "", school: "", details: [] }]);
  const removeEducation = (i: number) => setEducation(education.filter((_, idx) => idx !== i));

  // Experience helpers
  const updateExp = (i: number, field: string, val: string) => {
    const copy = [...experience];
    (copy[i] as any)[field] = val;
    setExperience(copy);
  };
  const addExperience = () => setExperience([...experience, { year: "", title: "", desc: "" }]);
  const removeExperience = (i: number) => setExperience(experience.filter((_, idx) => idx !== i));

  // Skills helpers
  const updateSkill = (arr: { name: string; pct: number }[], setter: Function, i: number, field: string, val: string | number) => {
    const copy = [...arr];
    (copy[i] as any)[field] = val;
    setter(copy);
  };
  const addSkill = (arr: { name: string; pct: number }[], setter: Function) => setter([...arr, { name: "", pct: 50 }]);
  const removeSkill = (arr: { name: string; pct: number }[], setter: Function, i: number) => setter(arr.filter((_, idx) => idx !== i));

  // Language helpers
  const updateLang = (i: number, field: string, val: string | number) => {
    const copy = [...languages];
    (copy[i] as any)[field] = val;
    setLanguages(copy);
  };
  const addLanguage = () => setLanguages([...languages, { name: "", pct: 50, level: "" }]);
  const removeLanguage = (i: number) => setLanguages(languages.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">Edit CV Information</h2>
        <Button className="gap-2" onClick={handleSave}><Save size={16} /> Save All</Button>
      </div>
      <p className="text-sm text-muted-foreground">Changes save to Firebase and appear instantly on the CV page.</p>

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Personal Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium text-foreground mb-1 block">Full Name</label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-foreground mb-1 block">Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-foreground mb-1 block">Phone</label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-foreground mb-1 block">Email</label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-foreground mb-1 block">Location</label><Input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-foreground mb-1 block">Address</label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          <div><label className="text-sm font-medium text-foreground mb-1 block">Date of Birth</label><Input value={dob} onChange={(e) => setDob(e.target.value)} /></div>
        </div>
        <div><label className="text-sm font-medium text-foreground mb-1 block">About Me</label><Textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4} /></div>
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">Education</h3>
          <Button size="sm" variant="outline" className="gap-1" onClick={addEducation}><Plus size={14} /> Add</Button>
        </div>
        {education.map((edu, i) => (
          <div key={i} className="p-4 rounded-lg border border-border bg-background space-y-3">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                <Input placeholder="Period (e.g. 2018-2022)" value={edu.period} onChange={e => updateEdu(i, "period", e.target.value)} />
                <Input placeholder="Degree" value={edu.degree} onChange={e => updateEdu(i, "degree", e.target.value)} />
                <Input placeholder="School" value={edu.school} onChange={e => updateEdu(i, "school", e.target.value)} />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive ml-2" onClick={() => removeEducation(i)}><Trash2 size={14} /></Button>
            </div>
            <div className="space-y-2 pl-4">
              <label className="text-xs font-medium text-muted-foreground">Details</label>
              {edu.details.map((d, di) => (
                <div key={di} className="flex gap-2">
                  <Input value={d} onChange={e => updateEduDetail(i, di, e.target.value)} className="text-sm" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeEduDetail(i, di)}><Trash2 size={12} /></Button>
                </div>
              ))}
              <Button size="sm" variant="ghost" className="text-xs gap-1" onClick={() => addEduDetail(i)}><Plus size={12} /> Add detail</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">Experience</h3>
          <Button size="sm" variant="outline" className="gap-1" onClick={addExperience}><Plus size={14} /> Add</Button>
        </div>
        {experience.map((exp, i) => (
          <div key={i} className="p-4 rounded-lg border border-border bg-background">
            <div className="flex gap-3 items-start">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                <Input placeholder="Year" value={exp.year} onChange={e => updateExp(i, "year", e.target.value)} />
                <Input placeholder="Title" value={exp.title} onChange={e => updateExp(i, "title", e.target.value)} />
                <Input placeholder="Description" value={exp.desc} onChange={e => updateExp(i, "desc", e.target.value)} />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeExperience(i)}><Trash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">Technical Skills</h3>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => addSkill(technicalSkills, setTechnicalSkills)}><Plus size={14} /> Add</Button>
        </div>
        {technicalSkills.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <Input className="flex-1" placeholder="Skill name" value={s.name} onChange={e => updateSkill(technicalSkills, setTechnicalSkills, i, "name", e.target.value)} />
            <div className="flex items-center gap-2 w-40">
              <input type="range" min={0} max={100} value={s.pct} onChange={e => updateSkill(technicalSkills, setTechnicalSkills, i, "pct", parseInt(e.target.value))} className="flex-1" />
              <span className="text-xs text-muted-foreground w-8">{s.pct}%</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSkill(technicalSkills, setTechnicalSkills, i)}><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>

      {/* Creative Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">Creative Skills</h3>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => addSkill(creativeSkills, setCreativeSkills)}><Plus size={14} /> Add</Button>
        </div>
        {creativeSkills.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <Input className="flex-1" placeholder="Skill name" value={s.name} onChange={e => updateSkill(creativeSkills, setCreativeSkills, i, "name", e.target.value)} />
            <div className="flex items-center gap-2 w-40">
              <input type="range" min={0} max={100} value={s.pct} onChange={e => updateSkill(creativeSkills, setCreativeSkills, i, "pct", parseInt(e.target.value))} className="flex-1" />
              <span className="text-xs text-muted-foreground w-8">{s.pct}%</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSkill(creativeSkills, setCreativeSkills, i)}><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">Languages</h3>
          <Button size="sm" variant="outline" className="gap-1" onClick={addLanguage}><Plus size={14} /> Add</Button>
        </div>
        {languages.map((l, i) => (
          <div key={i} className="flex items-center gap-3">
            <Input className="flex-1" placeholder="Language" value={l.name} onChange={e => updateLang(i, "name", e.target.value)} />
            <Input className="w-28" placeholder="Level" value={l.level} onChange={e => updateLang(i, "level", e.target.value)} />
            <div className="flex items-center gap-2 w-40">
              <input type="range" min={0} max={100} value={l.pct} onChange={e => updateLang(i, "pct", parseInt(e.target.value))} className="flex-1" />
              <span className="text-xs text-muted-foreground w-8">{l.pct}%</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeLanguage(i)}><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>

      <Button className="gap-2 w-full" size="lg" onClick={handleSave}><Save size={16} /> Save All Changes to Firebase</Button>
    </div>
  );
};

const SocialPanel = () => {
  const { cv, updateCV, saveToFirestore } = useCV();
  const [github, setGithub] = useState(cv.socialLinks?.github || "");
  const [linkedin, setLinkedin] = useState(cv.socialLinks?.linkedin || "");
  const [instagram, setInstagram] = useState(cv.socialLinks?.instagram || "");
  const [whatsapp, setWhatsapp] = useState(cv.socialLinks?.whatsapp || "");
  const [tiktok, setTiktok] = useState(cv.socialLinks?.tiktok || "");

  const handleSave = async () => {
    updateCV({ socialLinks: { github, linkedin, instagram, whatsapp, tiktok } });
    try {
      await saveToFirestore();
      toast.success("Social links saved!");
    } catch {
      toast.success("Social links updated locally.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-foreground">Social Links</h2>
      <p className="text-sm text-muted-foreground">Add your social media URLs. They will appear on your CV page.</p>
      <div className="space-y-4">
        <div><label className="text-sm font-medium text-foreground mb-1 block">GitHub URL</label><Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/username" /></div>
        <div><label className="text-sm font-medium text-foreground mb-1 block">LinkedIn URL</label><Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/username" /></div>
        <div><label className="text-sm font-medium text-foreground mb-1 block">Instagram URL</label><Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/username" /></div>
        <div><label className="text-sm font-medium text-foreground mb-1 block">WhatsApp Link</label><Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="https://wa.me/351927717490" /></div>
        <div><label className="text-sm font-medium text-foreground mb-1 block">TikTok URL</label><Input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="https://tiktok.com/@username" /></div>
      </div>
      <Button className="gap-2" onClick={handleSave}><Save size={16} /> Save Social Links</Button>
    </div>
  );
};

const ProductsPanel = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory } = useShop();
  const [showAdd, setShowAdd] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCat, setNewCat] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newCatKey, setNewCatKey] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});

  const handleAdd = async () => {
    if (!newTitle || !newPrice) return toast.error("Title and price required");
    await addProduct({
      title: newTitle,
      description: newDesc,
      price: parseFloat(newPrice),
      category: newCat || "courses",
      image: newImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
    });
    setNewTitle(""); setNewDesc(""); setNewPrice(""); setNewCat(""); setNewImage("");
    setShowAdd(false);
    toast.success("Product added!");
  };

  const handleAddCat = async () => {
    if (!newCatKey || !newCatLabel) return toast.error("Key and label required");
    await addCategory(newCatKey.toLowerCase().replace(/\s+/g, "-"), newCatLabel);
    setNewCatKey(""); setNewCatLabel("");
    setShowAddCat(false);
    toast.success("Category added!");
  };

  const handleSaveEdit = async (id: string) => {
    await updateProduct(id, editData);
    setEditId(null);
    setEditData({});
    toast.success("Product updated!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-semibold text-foreground">Manage Products</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowAddCat(!showAddCat)}>
            <Plus size={16} /> Category
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={16} /> Product
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <Badge key={c.id} variant="secondary" className="gap-1 text-xs">
            {c.label}
            <button onClick={() => { deleteCategory(c.id); toast.success("Category removed"); }} className="ml-1 text-destructive hover:text-destructive/80">×</button>
          </Badge>
        ))}
      </div>

      {/* Add Category Form */}
      {showAddCat && (
        <div className="p-4 rounded-lg border border-border bg-background space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Key (e.g. strategy-trading)" value={newCatKey} onChange={e => setNewCatKey(e.target.value)} />
            <Input placeholder="Label (e.g. Strategy Trading)" value={newCatLabel} onChange={e => setNewCatLabel(e.target.value)} />
          </div>
          <Button size="sm" onClick={handleAddCat}>Add Category</Button>
        </div>
      )}

      {/* Add Product Form */}
      {showAdd && (
        <div className="p-4 rounded-lg border border-border bg-background space-y-3">
          <Input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <Textarea placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Price" type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
            <select className="border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground" value={newCat} onChange={e => setNewCat(e.target.value)}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <Input placeholder="Image URL" value={newImage} onChange={e => setNewImage(e.target.value)} />
          <Button size="sm" onClick={handleAdd}>Add Product</Button>
        </div>
      )}

      {/* Product List */}
      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="p-4 rounded-lg border border-border bg-background">
            {editId === p.id ? (
              <div className="space-y-2">
                <Input value={editData.title ?? p.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
                <Input value={editData.description ?? p.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" value={editData.price ?? p.price} onChange={e => setEditData({ ...editData, price: parseFloat(e.target.value) })} />
                  <select className="border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground" value={editData.category ?? p.category} onChange={e => setEditData({ ...editData, category: e.target.value })}>
                    {categories.map(c => <option key={c.id} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveEdit(p.id)}><Save size={14} /> Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="capitalize text-xs">{p.category}</Badge>
                  <span className="font-medium text-foreground text-sm">{p.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary">${p.price}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditId(p.id); setEditData({}); }}><Pencil size={14} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteProduct(p.id); toast.success("Product removed!"); }}><Trash2 size={14} /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MessagesPanel = () => {
  const [chats, setChats] = useState<{ id: string; lastMessage: string; lastMessageAt: any; unread: boolean }[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ id: string; text: string; sender: string; createdAt: any }[]>([]);
  const [reply, setReply] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChats = async () => {
      const { collection: col, query: q, orderBy: ob, onSnapshot: snap } = await import("firebase/firestore");
      const { db: fireDb } = await import("@/lib/firebase");
      const chatsQuery = q(col(fireDb, "chats"), ob("lastMessageAt", "desc"));
      return snap(chatsQuery, (snapshot) => {
        setChats(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      });
    };
    const unsub = loadChats();
    return () => { unsub.then(u => u()); };
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    const loadMessages = async () => {
      const { collection: col, query: q, orderBy: ob, onSnapshot: snap } = await import("firebase/firestore");
      const { db: fireDb } = await import("@/lib/firebase");
      const msgsQuery = q(col(fireDb, "chats", selectedChat, "messages"), ob("createdAt", "asc"));
      return snap(msgsQuery, (snapshot) => {
        setChatMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      });
    };
    const unsub = loadMessages();
    return () => { unsub.then(u => u()); };
  }, [selectedChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendReply = async () => {
    if (!reply.trim() || !selectedChat) return;
    const { addDoc, collection: col, serverTimestamp, doc: docRef, updateDoc } = await import("firebase/firestore");
    const { db: fireDb } = await import("@/lib/firebase");
    await addDoc(col(fireDb, "chats", selectedChat, "messages"), {
      text: reply.trim(),
      sender: "admin",
      visitorId: selectedChat,
      createdAt: serverTimestamp(),
    });
    await updateDoc(docRef(fireDb, "chats", selectedChat), {
      lastMessage: reply.trim(),
      lastMessageAt: serverTimestamp(),
      unread: false,
    });
    setReply("");
  };

  const formatTime = (ts: any) => {
    if (!ts?.toDate) return "";
    return ts.toDate().toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-semibold text-foreground">Messages (Real-time)</h2>

      {!selectedChat ? (
        <div className="space-y-2">
          {chats.length === 0 && <p className="text-sm text-muted-foreground">No messages yet. Visitors can send messages from the Chat page.</p>}
          {chats.map((chat) => (
            <button key={chat.id} onClick={() => setSelectedChat(chat.id)}
              className="w-full p-4 rounded-lg border border-border bg-background hover:bg-accent/50 text-left transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-foreground text-sm flex items-center gap-2">
                  {chat.id.substring(0, 20)}...
                  {chat.unread && <span className="w-2 h-2 bg-primary rounded-full" />}
                </span>
                <span className="text-xs text-muted-foreground">{formatTime(chat.lastMessageAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedChat(null)}>← Back to conversations</Button>
          <div className="h-80 overflow-y-auto space-y-3 border border-border rounded-lg p-4 bg-background">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"
                }`}>
                  <p>{msg.text}</p>
                  <p className="text-[10px] opacity-70 mt-1">{formatTime(msg.createdAt)}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-2">
            <Input value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..."
              onKeyDown={e => e.key === "Enter" && sendReply()} className="flex-1" />
            <Button size="icon" onClick={sendReply} disabled={!reply.trim()}><Send size={16} /></Button>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsPanel = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-heading font-semibold text-foreground">Settings</h2>
    <div className="bg-accent/50 rounded-lg p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-2">🔥 Firebase Connected</h3>
      <p className="text-sm text-muted-foreground">
        Project: cv-davood-54a28 • Auth & Firestore active
      </p>
    </div>
    <div className="bg-accent/50 rounded-lg p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-2">🔒 Security</h3>
      <p className="text-sm text-muted-foreground">
        Admin access is hidden — only accessible via 5 taps on profile photo. 
        Firestore rules restrict writes to verified admins only.
      </p>
    </div>
  </div>
);

export default Admin;
