import { Schema, model } from "mongoose";

const complaintSchema = new Schema(
  {
    category: { type: String, required: [true, "Category is required!"] },
    sector: { type: String, required: [true, "Sector is required!"] },
    involved: String,
    witness: String,
    talkedAbout: String,
    details: String,
    previousComplaint: Number,
    agreement: { type: Boolean, required: [true, "Agreement is required!"] },
    name: String,
    role: String,
    email: {
      type: String,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    telephone: String,
    status: { type: String, default: "Aberto" },
    protocolo_id: {
      type: Number,
      required: [true, "Protocolo ID required!"],
      unique: true,
    },
  },
  { timestamps: true }
);

export default model("Complaint", complaintSchema);
