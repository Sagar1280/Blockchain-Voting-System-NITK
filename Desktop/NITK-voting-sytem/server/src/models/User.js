import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  roll: { type: String, unique: true, required: true }, // e.g., "221 EC 149"
  dept: { type: String, required: true },
  year: { type: String, required: true },
  passwordHash: { type: String, required: true },
  hasVoted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
