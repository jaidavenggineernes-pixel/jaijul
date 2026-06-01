import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  motto: string;
  description: string;
  homeroomTeacher: string;
  teacherQuote: string;
  history: string;
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    whatsapp?: string;
  };
}

const SettingSchema: Schema = new Schema({
  motto: { type: String, default: 'Code The Future, Define Reality' },
  description: { type: String, default: 'Kami adalah sekumpulan pemuda yang tertarik dengan teknologi dan rekayasa perangkat lunak. Bersama-sama kami membangun masa depan melalui baris kode.' },
  homeroomTeacher: { type: String, default: 'Bpk. / Ibu Guru' },
  teacherQuote: { type: String, default: 'Teruslah ngoding sampai errornya takut sama kalian.' },
  history: { type: String, default: 'Vanguard Class dibentuk pada tahun ajaran baru dengan semangat untuk menjadi pionir dalam inovasi teknologi di sekolah.' },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com/x.rpl2' },
    tiktok: { type: String, default: 'https://tiktok.com/@vanguard' },
    whatsapp: { type: String, default: 'https://wa.me/628123456789' }
  }
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
