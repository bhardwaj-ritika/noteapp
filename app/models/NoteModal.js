import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    text: { type: String, required: true },
    url: { type: String },
    image: { type: String }, // Base64 encoded string or URL
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
