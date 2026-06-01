"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, MessageCircle, MapPin, Mail, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [settings, setSettings] = useState({
    socialLinks: { instagram: "#", whatsapp: "#", tiktok: "#" }
  });

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && data.socialLinks) {
          setSettings({ socialLinks: data.socialLinks });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error("Nama dan pesan wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error("Gagal mengirim");
      
      setIsSuccess(true);
      setFormData({ name: "", message: "" });
      toast.success("Pesan berhasil dikirim!");
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (e) {
      toast.error("Terjadi kesalahan saat mengirim pesan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white neon-text mb-4">Hubungi Kami</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Tetap terhubung dengan Vanguard Class melalui sosial media atau form kontak di bawah ini.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Informasi Kontak</h2>
            <div className="space-y-4">
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-primary transition-colors group">
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Instagram</p>
                  <p className="font-medium truncate max-w-[200px]">{settings.socialLinks.instagram !== "#" ? settings.socialLinks.instagram : "@SOFT ENGGINEER'2"}</p>
                </div>
              </a>
              <a href={settings.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-green-400 transition-colors group">
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-green-400/20 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">WhatsApp (Admin Kelas)</p>
                  <p className="font-medium truncate max-w-[200px]">{settings.socialLinks.whatsapp !== "#" ? settings.socialLinks.whatsapp : "+62 851-9121-9129"}</p>
                </div>
              </a>
              <a href={settings.socialLinks.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-blue-400 transition-colors group">
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-blue-400/20 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a5.63 5.63 0 0 1-1.04-.1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">TikTok</p>
                  <p className="font-medium truncate max-w-[200px]">{settings.socialLinks.tiktok !== "#" ? settings.socialLinks.tiktok : "@x.rpl.two"}</p>
                </div>
              </a>
              <div className="flex items-center gap-4 text-gray-300 group">
                <div className="p-3 bg-white/5 rounded-full">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lokasi</p>
                  <p className="font-medium">SMKN 1 PACITAN, Jawa Timur</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 rounded-2xl neon-border relative overflow-hidden"
        >
          {isSuccess ? (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pesan Terkirim!</h3>
              <p className="text-gray-300 text-sm">Terima kasih telah menghubungi kami. Pesan Anda telah masuk ke dashboard admin Vanguard.</p>
            </div>
          ) : null}

          <h2 className="text-xl font-bold text-white mb-6">Kirim Pesan</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nama</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                placeholder="Nama Anda" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Pesan</label>
              <textarea 
                rows={4} 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                placeholder="Pesan Anda..." 
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? "Mengirim..." : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Pesan
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

