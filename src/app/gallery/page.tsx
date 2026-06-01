"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          // Fallback just in case
          setItems([
            { _id: "1", title: "Study Tour", imageUrl: "https://images.unsplash.com/photo-1523580494112-7476579cdb8d?q=80&w=600&auto=format&fit=crop", description: "Kegiatan study tour kelas." },
            { _id: "2", title: "Coding Bootcamp", imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop", description: "Sesi coding bersama." },
          ]);
        }
      })
      .catch(() => {
        setItems([
          { _id: "1", title: "Study Tour", imageUrl: "https://images.unsplash.com/photo-1523580494112-7476579cdb8d?q=80&w=600&auto=format&fit=crop", description: "Kegiatan study tour kelas." },
          { _id: "2", title: "Coding Bootcamp", imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop", description: "Sesi coding bersama." },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white neon-text mb-4">Gallery Kelas</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Dokumentasi kegiatan dan momen kebersamaan Vanguard Class.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="break-inside-avoid"
            >
              <div className="glass-panel rounded-2xl overflow-hidden group relative cursor-pointer border border-white/5 hover:border-primary/50 transition-colors">
                <div className="relative aspect-[3/4] sm:aspect-auto">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-300">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
