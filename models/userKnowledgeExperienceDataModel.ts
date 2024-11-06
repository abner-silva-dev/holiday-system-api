import mongoose, { Schema, Document, Model } from "mongoose";

interface KnowledgeExperienceDataDocument extends Document {
  // Languages
  english: {
    speakingPer: number;
    writtingPer: number;
  };
  secondLanguage: {
    language: string;
    speakingPer: number;
    writtingPer: number;
  };

  // Experience Areas
  areas: string[];

  // Practical Experience
  hasPracticalExperience: string;
  practicalExperience: string;

  user: mongoose.Types.ObjectId;
}

const knowledgeExperienceDataSchema =
  new Schema<KnowledgeExperienceDataDocument>(
    {
      // English Language Proficiency
      english: {
        speakingPer: { type: Number, required: false, min: 0, max: 100 },
        writtingPer: { type: Number, required: false, min: 0, max: 100 },
      },
      // Second Language Proficiency
      secondLanguage: {
        language: { type: String, required: false },
        speakingPer: { type: Number, required: false, min: 0, max: 100 },
        writtingPer: { type: Number, required: false, min: 0, max: 100 },
      },
      // Experience Areas
      areas: {
        type: [String],
        required: [true, "Por favor, ingrese al menos un área de experiencia"],
      },
      // Practical Experience
      hasPracticalExperience: {
        type: String,
        enum: ["si", "no"],
        required: true,
      },
      practicalExperience: {
        type: String,
        required: function () {
          return this.hasPracticalExperience === "Sí";
        },
      },
      // Reference to User
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [
          true,
          "Los datos de conocimiento y experiencia deben estar asociados a un usuario",
        ],
      },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
  );

const UserKnowledgeExperienceData: Model<KnowledgeExperienceDataDocument> =
  mongoose.model<KnowledgeExperienceDataDocument>(
    "UserKnowledgeExperienceData",
    knowledgeExperienceDataSchema
  );

export default UserKnowledgeExperienceData;
