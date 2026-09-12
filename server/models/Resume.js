import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, default: '' },
  jobDescription: { type: String, default: '' },
  atsScore: { type: Number, default: null },
  suggestions: { type: mongoose.Schema.Types.Mixed, default: null },
  penalties: { type: mongoose.Schema.Types.Mixed, default: null }
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);