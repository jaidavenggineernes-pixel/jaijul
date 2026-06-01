"use client";

import { useEffect, useState } from "react";
import { Users, LogIn, Activity } from "lucide-react";

interface UserLog {
  _id: string;
  name: string;
  role: string;
  lastLogin: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserLog[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, todayLogins: 0 });

  useEffect(() => {
    // In real app, fetch from /api/users
    // fetch("/api/users").then(res => res.json()).then(setUsers);
    
    // Mock data
    const mockUsers = [
      { _id: "1", name: "Admin (Saya)", role: "admin", lastLogin: new Date().toISOString() },
      { _id: "2", name: "Siswa A", role: "user", lastLogin: new Date(Date.now() - 3600000).toISOString() },
      { _id: "3", name: "Siswa B", role: "user", lastLogin: new Date(Date.now() - 86400000).toISOString() },
    ];
    setUsers(mockUsers);
    setStats({
      totalUsers: 36,
      todayLogins: 12
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Selamat datang di panel kontrol Vanguard Class.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-primary/20 rounded-xl">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Anggota/Siswa</p>
            <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-green-500/20 rounded-xl">
            <Activity className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Pengunjung Hari Ini</p>
            <p className="text-2xl font-bold text-white">{stats.todayLogins}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <LogIn className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white">Log Pengunjung Terakhir</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-3 px-4 font-medium">Nama</th>
                <th className="pb-3 px-4 font-medium">Role</th>
                <th className="pb-3 px-4 font-medium">Terakhir Login</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white font-medium">{user.name}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-primary/20 text-primary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {new Date(user.lastLogin).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
