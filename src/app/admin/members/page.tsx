"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Member {
  _id: string;
  name: string;
  absen?: number;
  role: string;
  bio?: string;
  image?: string;
  socials?: {
    instagram?: string;
    github?: string;
  };
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: "", absen: "", role: "Anggota", bio: "", image: "", instagram: "", github: "" 
  });

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      if (Array.isArray(data)) setMembers(data);
    } catch (e) {
      toast.error("Gagal mengambil data dari database");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Ukuran gambar maksimal 2MB");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const openModal = (member?: Member) => {
    if (member) {
      setEditingId(member._id);
      setFormData({
        name: member.name,
        absen: member.absen?.toString() || "",
        role: member.role,
        bio: member.bio || "",
        image: member.image || "",
        instagram: member.socials?.instagram || "",
        github: member.socials?.github || ""
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", absen: "", role: "Anggota", bio: "", image: "", instagram: "", github: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Nama wajib diisi!");
    setIsLoading(true);

    const payload = {
      name: formData.name,
      absen: formData.absen ? parseInt(formData.absen) : undefined,
      role: formData.role,
      bio: formData.bio,
      image: formData.image,
      socials: {
        instagram: formData.instagram,
        github: formData.github
      }
    };

    try {
      const url = editingId ? `/api/members/${editingId}` : "/api/members";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      
      toast.success(`Data berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}`);
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus anggota ini?")) return;
    
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Anggota berhasil dihapus");
      fetchMembers();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manajemen Anggota</h1>
          <p className="text-gray-400">Tambah, edit, atau hapus data anggota kelas.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg transition-colors neon-border"
        >
          <Plus className="w-4 h-4" />
          Tambah Anggota
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm bg-black/20">
                <th className="py-4 px-6 font-medium">Profil</th>
                <th className="py-4 px-6 font-medium">Absen</th>
                <th className="py-4 px-6 font-medium">Role / Jabatan</th>
                <th className="py-4 px-6 font-medium">Sosmed</th>
                <th className="py-4 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {members.map((member) => (
                <tr key={member._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 text-white font-medium flex items-center gap-3">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p>{member.name}</p>
                      <p className="text-xs text-gray-500 font-normal truncate max-w-[150px]">{member.bio || "-"}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-300">{member.absen || "-"}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-gray-300 border border-white/5">
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    <div className="flex gap-2">
                      {member.socials?.instagram && <span className="w-2 h-2 rounded-full bg-pink-500" title="Instagram" />}
                      {member.socials?.github && <span className="w-2 h-2 rounded-full bg-gray-400" title="Github" />}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(member)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(member._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Belum ada data anggota
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-white/10 my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{editingId ? "Edit Anggota" : "Tambah Anggota"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex justify-center mb-6">
                  <label className="relative cursor-pointer group">
                    <div className={`w-24 h-24 rounded-full overflow-hidden border-2 border-dashed flex items-center justify-center transition-colors ${formData.image ? 'border-primary' : 'border-gray-500 group-hover:border-primary'}`}>
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-gray-500 group-hover:text-primary transition-colors">
                          <UploadCloud className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-[10px]">Upload Foto</span>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nama Lengkap *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                      placeholder="Masukkan nama..."
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">No. Absen</label>
                    <input 
                      type="number" 
                      value={formData.absen}
                      onChange={(e) => setFormData({...formData, absen: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                      placeholder="Contoh: 12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role / Jabatan</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Anggota">Anggota Biasa</option>
                    <option value="Ketua Kelas">Ketua Kelas</option>
                    <option value="Wakil Ketua">Wakil Ketua</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Bendahara">Bendahara</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Link Instagram</label>
                    <input 
                      type="text" 
                      value={formData.instagram}
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors" 
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Link Github</label>
                    <input 
                      type="text" 
                      value={formData.github}
                      onChange={(e) => setFormData({...formData, github: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors" 
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Bio / Moto Singkat</label>
                  <textarea 
                    rows={2} 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                    placeholder="Kata-kata andalan..."
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
