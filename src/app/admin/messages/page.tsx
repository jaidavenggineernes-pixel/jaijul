"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Message {
  _id: string;
  name: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (e) {
      toast.error("Gagal mengambil data pesan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentStatus })
      });
      if (!res.ok) throw new Error("Gagal mengupdate status");
      
      // Update state locally for snappier UI
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: !currentStatus } : m));
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return;
    
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Pesan berhasil dihapus");
      setMessages(messages.filter(m => m._id !== id));
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus pesan");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Catatan Admin</h1>
        <p className="text-gray-400">Pesan dan masukan yang dikirimkan oleh pengunjung website melalui form kontak.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            Memuat data pesan...
          </div>
        ) : messages.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Kotak Masuk Kosong</h3>
            <p className="text-gray-400">Belum ada pesan dari pengunjung.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg._id} 
              className={`glass-panel p-6 rounded-2xl border transition-all ${
                msg.isRead ? 'border-white/5 opacity-80' : 'border-primary/50 shadow-[0_0_15px_rgba(56,189,248,0.1)]'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    msg.isRead ? 'bg-white/10 text-gray-400' : 'bg-primary/20 text-primary'
                  }`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`font-bold ${msg.isRead ? 'text-gray-300' : 'text-white'}`}>{msg.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatDate(msg.createdAt)}
                    </div>
                  </div>
                </div>
                {!msg.isRead && (
                  <span className="px-2 py-1 text-[10px] font-bold bg-primary/20 text-primary rounded-full border border-primary/30">
                    BARU
                  </span>
                )}
              </div>
              
              <div className={`p-4 rounded-xl mb-6 text-sm leading-relaxed ${
                msg.isRead ? 'bg-white/5 text-gray-400' : 'bg-black/40 text-gray-200'
              }`}>
                {msg.message}
              </div>

              <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
                <button 
                  onClick={() => handleMarkAsRead(msg._id, msg.isRead)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    msg.isRead 
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white' 
                      : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {msg.isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                </button>
                <button 
                  onClick={() => handleDelete(msg._id)}
                  className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
