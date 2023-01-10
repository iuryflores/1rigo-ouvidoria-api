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
    claimantFullName: String,
    claimantJob: String,
    claimantEmail: {
      type: String,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    claimantPhone: String,
  },
  { timestamps: true }
);

export default model("Complaint", complaintSchema);
