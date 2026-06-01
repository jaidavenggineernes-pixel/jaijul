"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save, UploadCloud, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Gallery {
  _id: string;
  title: string;
  imageUrl: string;
  description?: string;
  order?: number;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<Gallery[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ title: "", imageUrl: "", description: "", order: 0 });

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (e) {
      toast.error("Gagal mengambil data gallery");
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Ukuran gambar maksimal 5MB");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const openModal = (item?: Gallery) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        title: item.title,
        imageUrl: item.imageUrl,
        description: item.description || "",
        order: item.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", imageUrl: "", description: "", order: items.length });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) return toast.error("Judul dan Foto wajib diisi!");
    setIsLoading(true);

    try {
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      
      toast.success(`Foto berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}`);
      setIsModalOpen(false);
      fetchGallery();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Foto berhasil dihapus");
      fetchGallery();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manajemen Gallery</h1>
          <p className="text-gray-400">Upload dan kelola foto kenangan kelas Vanguard.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg transition-colors neon-border"
        >
          <Plus className="w-4 h-4" />
          Tambah Foto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div 
            key={item._id} 
            layoutId={item._id}
            className="glass-panel rounded-2xl overflow-hidden border border-white/5 group relative"
          >
            <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2 z-10">
              <button onClick={() => openModal(item)} className="p-2 bg-blue-500/80 text-white hover:bg-blue-600 rounded-lg transition-colors backdrop-blur-sm">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/80 text-white hover:bg-red-600 rounded-lg transition-colors backdrop-blur-sm">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-move">
              <div className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-sm border border-white/10" title="Urutan: ${item.order}">
                <GripVertical className="w-4 h-4" />
              </div>
            </div>

            <div className="aspect-[4/3] w-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0" />
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-lg font-bold text-white line-clamp-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-300 line-clamp-2 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <UploadCloud className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gallery Kosong</h3>
            <p className="text-gray-400">Belum ada foto yang diupload ke gallery kelas.</p>
          </div>
        )}
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
                <h3 className="text-xl font-bold text-white">{editingId ? "Edit Foto" : "Upload Foto Baru"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Foto / Gambar *</label>
                  <label className="relative cursor-pointer group block">
                    <div className={`w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center transition-colors ${formData.imageUrl ? 'border-primary' : 'border-gray-500 group-hover:border-primary'}`}>
                      {formData.imageUrl ? (
                        <div className="relative w-full h-full">
                          <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white font-medium flex items-center gap-2">
                              <UploadCloud className="w-5 h-5" /> Ganti Foto
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 group-hover:text-primary transition-colors py-12">
                          <UploadCloud className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">Klik untuk upload foto</p>
                          <p className="text-xs text-gray-400 mt-1">Maksimal 5MB (Disarankan Landscape)</p>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Judul Foto *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                    placeholder="Contoh: Juara Classmeet 2024"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Deskripsi / Caption (Opsional)</label>
                    <textarea 
                      rows={2} 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                      placeholder="Ceritakan sedikit tentang foto ini..."
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Urutan</label>
                    <input 
                      type="number" 
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" 
                      placeholder="0"
                    />
                  </div>
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
