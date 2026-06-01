"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, GraduationCap, History, Camera, Code, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface Member {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  socials?: {
    instagram?: string;
    github?: string;
  };
}

export default function ProfilePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  const [settings, setSettings] = useState({
    history: "Terbentuk pada tahun ajaran baru, Vanguard Class (X RPL 2) didirikan dengan semangat untuk menjadi pionir dalam inovasi perangkat lunak di SMKN 1 PACITAN. Nama \"Vanguard\" melambangkan posisi kami di garis depan perkembangan teknologi.",
    homeroomTeacher: "Bapak / Ibu Guru",
    teacherQuote: "Teruslah ngoding sampai errornya takut sama kalian."
  });

  useEffect(() => {
    // Fetch Members
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMembers(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch Settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings({
            history: data.history || settings.history,
            homeroomTeacher: data.homeroomTeacher || settings.homeroomTeacher,
            teacherQuote: data.teacherQuote || settings.teacherQuote
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white neon-text mb-4">Profile Kelas</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Mengenal lebih dekat sejarah, struktur, dan anggota dari Vanguard Class.</p>
      </motion.div>

      {/* Sejarah & Wali Kelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <History className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">Sejarah Kelas</h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
            {settings.history}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-8 rounded-2xl neon-border relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <GraduationCap className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <GraduationCap className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">Wali Kelas</h2>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-primary mb-1">{settings.homeroomTeacher}</h3>
            <p className="text-gray-400 text-sm">Guru Pembimbing Vanguard</p>
            <p className="text-gray-300 mt-4 text-sm italic">
              "{settings.teacherQuote}"
            </p>
          </div>
        </motion.div>
      </div>

      {/* Anggota Kelas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Users className="text-primary w-8 h-8" />
          <h2 className="text-3xl font-bold text-white neon-text">Anggota Kelas</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.length > 0 ? (
              members.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedMember(member)}
                  className="glass-panel p-6 rounded-xl text-center group border border-white/5 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white truncate">{member.name}</h3>
                  <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs text-primary mt-2 mb-3">
                    {member.role}
                  </span>
                  {member.bio && (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4">{member.bio}</p>
                  )}
                  
                  {(member.socials?.instagram || member.socials?.github) && (
                    <div className="flex justify-center gap-3 mt-auto pt-4 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                      {member.socials.instagram && (
                        <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                          <Camera className="w-4 h-4" />
                        </a>
                      )}
                      {member.socials.github && (
                        <a href={member.socials.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                          <Code className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                Belum ada data anggota.
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Modal Detail Anggota */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-gray-400 hover:text-white transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-black bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-lg">
                    {selectedMember.image ? (
                      <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {selectedMember.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedMember.name}</h3>
                  <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium mb-6">
                    {selectedMember.role}
                  </span>

                  {selectedMember.bio ? (
                    <div className="w-full bg-black/30 rounded-xl p-5 border border-white/5 mb-6 text-left">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <span>📝</span> Biodata & Pesan
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                        {selectedMember.bio}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mb-6 italic">Belum ada biodata yang ditambahkan.</p>
                  )}

                  {(selectedMember.socials?.instagram || selectedMember.socials?.github) && (
                    <div className="flex gap-4">
                      {selectedMember.socials.instagram && (
                        <a 
                          href={selectedMember.socials.instagram} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 border border-pink-500/20 hover:border-pink-500/50 rounded-xl transition-all"
                        >
                          <Camera className="w-4 h-4" />
                          <span className="text-sm font-medium">Instagram</span>
                        </a>
                      )}
                      {selectedMember.socials.github && (
                        <a 
                          href={selectedMember.socials.github} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 rounded-xl transition-all"
                        >
                          <Code className="w-4 h-4" />
                          <span className="text-sm font-medium">GitHub</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

