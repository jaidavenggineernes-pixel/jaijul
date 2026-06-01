"use client";

import { useState, useEffect } from "react";
import { Settings2, Save } from "lucide-react";
import { toast } from "sonner";

interface SiteSettings {
  motto: string;
  description: string;
  homeroomTeacher: string;
  teacherQuote: string;
  history: string;
  socialLinks: {
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
}

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<SiteSettings>({
    motto: "",
    description: "",
    homeroomTeacher: "",
    teacherQuote: "",
    history: "",
    socialLinks: {
      instagram: "",
      tiktok: "",
      whatsapp: ""
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data && !data.error) {
          setFormData({
            motto: data.motto || "",
            description: data.description || "",
            homeroomTeacher: data.homeroomTeacher || "",
            teacherQuote: data.teacherQuote || "",
            history: data.history || "",
            socialLinks: {
              instagram: data.socialLinks?.instagram || "",
              tiktok: data.socialLinks?.tiktok || "",
              whatsapp: data.socialLinks?.whatsapp || ""
            }
          });
        }
      } catch (e) {
        toast.error("Gagal memuat pengaturan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error("Gagal menyimpan");
      toast.success("Pengaturan website berhasil disimpan!");
    } catch (e) {
      toast.error("Terjadi kesalahan saat menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSocialChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [field]: value
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Memuat pengaturan...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pengaturan Website</h1>
        <p className="text-gray-400">Atur konten teks utama yang muncul di halaman depan dan profile website Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section: Identitas Kelas */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Identitas Kelas</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Moto Kelas</label>
            <input 
              type="text" 
              value={formData.motto}
              onChange={(e) => setFormData({...formData, motto: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-lg font-medium" 
              placeholder="Contoh: Code The Future, Define Reality"
            />
            <p className="text-xs text-gray-500 mt-2">Motto akan ditampilkan besar di halaman utama (Beranda).</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Deskripsi Singkat</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
              placeholder="Deskripsikan kelas Vanguard..."
            />
            <p className="text-xs text-gray-500 mt-2">Muncul di bawah tulisan selamat datang di beranda.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nama Wali Kelas</label>
            <input 
              type="text" 
              value={formData.homeroomTeacher}
              onChange={(e) => setFormData({...formData, homeroomTeacher: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
              placeholder="Contoh: Bpk. John Doe, S.Kom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Pesan / Quote Wali Kelas</label>
            <input 
              type="text" 
              value={formData.teacherQuote}
              onChange={(e) => setFormData({...formData, teacherQuote: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
              placeholder="Contoh: Teruslah belajar sampai sukses."
            />
            <p className="text-xs text-gray-500 mt-2">Pesan singkat ini akan tampil di bawah nama Wali Kelas di halaman Profile.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Sejarah Kelas / About Us</label>
            <textarea 
              rows={5}
              value={formData.history}
              onChange={(e) => setFormData({...formData, history: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" 
              placeholder="Tuliskan sejarah terbentuknya kelas ini..."
            />
            <p className="text-xs text-gray-500 mt-2">Paragraf panjang yang akan ditampilkan di halaman Profile Kelas.</p>
          </div>
        </div>

        {/* Section: Sosial Media */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">Sosial Media Kelas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Link Instagram</label>
              <input 
                type="text" 
                value={formData.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Link TikTok</label>
              <input 
                type="text" 
                value={formData.socialLinks.tiktok}
                onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                placeholder="https://tiktok.com/..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Link WhatsApp / Grup</label>
              <input 
                type="text" 
                value={formData.socialLinks.whatsapp}
                onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                placeholder="https://wa.me/..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-8 flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] disabled:opacity-50 disabled:shadow-none"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
