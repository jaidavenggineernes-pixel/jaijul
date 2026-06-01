"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, ClipboardList, Utensils } from "lucide-react";

interface Schedule {
  _id: string;
  day: string;
  subjects: string[];
  picket: string[];
  mbg?: string;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schedules")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSchedules(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const defaultDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white neon-text mb-4">Jadwal Kelas</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Informasi jadwal pelajaran, piket kebersihan, dan MBG Vanguard Class.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(schedules.length > 0 ? schedules : defaultDays.map(day => ({ _id: day, day, subjects: [], picket: [], mbg: undefined } as Schedule))).map((schedule, index) => (
            <motion.div
              key={schedule._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="glass-panel p-6 rounded-2xl hover:border-primary/50 transition-colors border border-white/5"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <h2 className="text-2xl font-bold text-primary">{schedule.day}</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-white">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold">Mata Pelajaran</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schedule.subjects?.length > 0 ? (
                      schedule.subjects.map((subject, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm text-gray-300">
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Belum ada jadwal</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-white">
                      <ClipboardList className="w-5 h-5 text-green-400" />
                      <h3 className="font-semibold">Jadwal Piket</h3>
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                      {schedule.picket?.length > 0 ? (
                        schedule.picket.map((person, idx) => (
                          <li key={idx}>{person}</li>
                        ))
                      ) : (
                        <li>Belum ada jadwal</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3 text-white">
                      <Utensils className="w-5 h-5 text-orange-400" />
                      <h3 className="font-semibold">Jadwal MBG</h3>
                    </div>
                    <div className="text-sm text-gray-400 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                      {schedule.mbg || "Belum ada informasi MBG"}
                    </div>
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
