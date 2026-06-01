"use client";

import { motion } from "framer-motion";
import { Code2, Terminal, Cpu, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="font-mono text-xl text-primary neon-text">
      {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
};

export default function Home() {
  const [settings, setSettings] = useState({
    motto: "Code The Future, Define Reality",
    description: "Kami adalah siswa-siswi Rekayasa Perangkat Lunak angkatan ke-10 yang berdedikasi untuk mempelajari teknologi modern, menciptakan inovasi, dan membangun masa depan digital."
  });

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setSettings({
            motto: data.motto || settings.motto,
            description: data.description || settings.description
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl flex flex-col items-center text-center space-y-8 mt-10"
      >
        <div className="glass-panel px-6 py-2 rounded-full inline-flex items-center gap-2 mb-4">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-sm text-gray-300 font-mono tracking-wider">SYSTEM.INIT() // VANGUARD</span>
        </div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-white">Selamat Datang di </span>
          <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary neon-text">
            Vanguard Class
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-400 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          X RPL 2 - SMKN 1 PACITAN
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-panel p-6 rounded-2xl max-w-2xl mt-8 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
          <h2 className="text-2xl font-bold text-white mb-2 italic">"{settings.motto}"</h2>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {settings.description}
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link href="/profile" className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-105 neon-border">
            Lihat Profile
          </Link>
          <Link href="/gallery" className="px-8 py-3 rounded-full glass-panel text-white font-medium hover:bg-white/10 transition-all hover:scale-105 border border-white/20">
            Gallery Kelas
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center gap-3 hover:-translate-y-2 transition-transform duration-300">
            <div className="p-3 bg-primary/20 rounded-full text-primary">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white">Software Engineering</h3>
            <p className="text-sm text-gray-400">Mempelajari fundamental programming dan modern tech stack.</p>
          </div>
          <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center gap-3 hover:-translate-y-2 transition-transform duration-300">
            <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white">Hardware & Logic</h3>
            <p className="text-sm text-gray-400">Memahami arsitektur komputer dan logika algoritma.</p>
          </div>
          <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center gap-3 hover:-translate-y-2 transition-transform duration-300">
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white">Fast Learning</h3>
            <p className="text-sm text-gray-400">Beradaptasi cepat dengan perkembangan teknologi terbaru.</p>
          </div>
        </motion.div>

        <div className="mt-12">
          <DigitalClock />
        </div>
      </motion.div>
    </div>
  );
}
