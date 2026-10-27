import { Schema, models, model } from 'mongoose';

const ProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    layout: { type: String, default: 'traditional' },
    lessons: { type: Schema.Types.Mixed, default: {} },
    level2: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

ProgressSchema.index({ userId: 1 }, { unique: true });

export default models.Progress || model('Progress', ProgressSchema);
