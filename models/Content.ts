import { Schema, models, model } from 'mongoose';

const ContentSchema = new Schema(
  {
    type: { type: String, enum: ['word', 'sentence', 'paragraph'], required: true, index: true },
    text: { type: String, required: true },
    seedKey: { type: String },
    difficulty: { type: Number, default: 1 },
    tags: [String],
  },
  { timestamps: true },
);
ContentSchema.index({ seedKey: 1 }, { unique: true, sparse: true });

export default models.Content || model('Content', ContentSchema);
