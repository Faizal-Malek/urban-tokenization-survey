import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionnaire extends Document {
  responses: any;
  submittedAt: Date;
}

const questionnaireSchema = new Schema<IQuestionnaire>({
  responses: {
    type: Schema.Types.Mixed,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Questionnaire = mongoose.model<IQuestionnaire>('Questionnaire', questionnaireSchema); 