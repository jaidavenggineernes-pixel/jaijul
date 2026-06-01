import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
  name: string;
  absen?: number;
  role: string;
  bio?: string;
  image?: string; // Will store Base64 or URL
  socials?: {
    instagram?: string;
    github?: string;
  };
}

const MemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  absen: { type: Number },
  role: { type: String, default: 'Anggota' }, // e.g., Ketua Kelas, Wakil, Anggota
  bio: { type: String },
  image: { type: String },
  socials: {
    instagram: { type: String },
    github: { type: String },
  }
}, { timestamps: true });

export default mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);
