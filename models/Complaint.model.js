import { Schema, model } from "mongoose";

const complaintSchema = new Schema(
  {
    category: { type: String, required: [true, "Category is required!"] },
    etapa: { type: String, required: true, default: "ouvidoria" },
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
    status: { type: String, default: "pendente" },
    protocolo_id: {
      type: Number,
      required: [true, "Protocolo ID required!"],
      unique: true,
    },
    responsible_id: { type: Schema.Types.ObjectId, ref: "Users" },
    responsible_name: { type: "String", required: true, default: "Anônimo" },
    audits: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audit",
      },
    ],
  },
  { timestamps: true }
);

export default model("Complaint", complaintSchema);
