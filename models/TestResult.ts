import { Schema, models, model } from 'mongoose';

const TestResultSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    mode: { type: String, enum: ['timer', 'words'], required: true },
    duration: Number,
    wordCount: Number,
    layout: { type: String, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    errors: { type: Number, required: true },
    textId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false, suppressReservedKeysWarning: true },
);

TestResultSchema.index({ mode: 1, layout: 1, wpm: -1, createdAt: -1 });

export default models.TestResult || model('TestResult', TestResultSchema);
