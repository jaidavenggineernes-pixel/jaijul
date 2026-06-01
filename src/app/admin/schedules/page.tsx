"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Schedule {
  _id: string;
  day: string;
  subjects: string[];
  picket: string[];
  mbg?: string;
}

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ day: "Senin", subjects: "", picket: "", mbg: "" });

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/schedules");
      const data = await res.json();
      if (Array.isArray(data)) setSchedules(data);
    } catch (e) {
      toast.error("Gagal mengambil data jadwal");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingId(schedule._id);
      setFormData({
        day: schedule.day,
        subjects: schedule.subjects.join(", "),
        picket: schedule.picket.join(", "),
        mbg: schedule.mbg || ""
      });
    } else {
      setEditingId(null);
      setFormData({ day: "Senin", subjects: "", picket: "", mbg: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.day) return toast.error("Hari wajib diisi!");
    setIsLoading(true);

    const payload = {
      day: formData.day,
      subjects: formData.subjects.split(",").map(s => s.trim()).filter(Boolean),
      picket: formData.picket.split(",").map(s => s.trim()).filter(Boolean),
      mbg: formData.mbg,
    };

    try {
      const url = editingId ? `/api/schedules/${editingId}` : "/api/schedules";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      
      toast.success(`Jadwal berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}`);
      setIsModalOpen(false);
      fetchSchedules();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) return;
    
    try {
      const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Jadwal berhasil dihapus");
      fetchSchedules();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manajemen Jadwal</h1>
          <p className="text-gray-400">Atur jadwal pelajaran, piket, dan MBG harian kelas.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg transition-colors neon-border"
        >
          <Plus className="w-4 h-4" />
          Tambah Jadwal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {schedules.map((schedule) => (
          <div key={schedule._id} className="glass-panel p-6 rounded-xl border border-white/5 relative group">
            <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
              <button onClick={() => openModal(schedule)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(schedule._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-primary mb-4 border-b border-white/10 pb-2 inline-block">
              {schedule.day}
            </h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-400 block mb-1">Mata Pelajaran:</span>
                <div className="flex flex-wrap gap-2">
                  {schedule.subjects.map((sub, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 rounded border border-white/10 text-gray-300">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-gray-400 block mb-1">Petugas Piket:</span>
                <span className="text-white">{schedule.picket.join(", ")}</span>
              </div>
              
              <div>
                <span className="text-gray-400 block mb-1">Menu MBG:</span>
                <span className="text-orange-400 font-medium">{schedule.mbg || "-"}</span>
              </div>
            </div>
          </div>
        ))}
        {schedules.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500">
            Belum ada data jadwal
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-md rounded-2xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{editingId ? "Edit Jadwal" : "Tambah Jadwal"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Hari</label>
                  <select 
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Mata Pelajaran (Pisahkan dgn koma)</label>
                  <input 
                    type="text" 
                    value={formData.subjects}
                    onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                    placeholder="Contoh: Matematika, B. Indo, RPL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Petugas Piket (Pisahkan dgn koma)</label>
                  <input 
                    type="text" 
                    value={formData.picket}
                    onChange={(e) => setFormData({...formData, picket: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                    placeholder="Contoh: Budi, Siti, Andi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Menu MBG (Opsional)</label>
                  <input 
                    type="text" 
                    value={formData.mbg}
                    onChange={(e) => setFormData({...formData, mbg: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                    placeholder="Contoh: Nasi Uduk / Ayam Goreng"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? "Menyimpan..." : "Simpan Data"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

