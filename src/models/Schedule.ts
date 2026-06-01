import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  day: string;
  subjects: string[];
  picket: string[];
  mbg?: string; // Makan Bergizi Gratis schedule/info for the day
}

const ScheduleSchema: Schema = new Schema({
  day: { type: String, required: true, unique: true }, // Senin, Selasa, dst
  subjects: [{ type: String }],
  picket: [{ type: String }],
  mbg: { type: String }
}, { timestamps: true });

export default mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', ScheduleSchema);
