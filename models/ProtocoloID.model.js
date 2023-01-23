import { Schema, model } from "mongoose";

const protocoloID = new Schema(
  {
    protocolo_id: { type: Number, required: true },
    protocolo_pass: { type: String, required: true, unique: false },
    complaint_ID: {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
    },
  },
  { timestamps: true }
);
export default model("Protocolo", protocoloID);
