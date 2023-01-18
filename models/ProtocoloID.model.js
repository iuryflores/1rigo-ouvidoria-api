import { Schema, model } from "mongoose";

const protocoloID = new Schema(
  {
    protocolo_id: { type: Number, required: true, ref: "Complaint" },
  },
  { timestamps: true }
);
export default model("Protocolo", protocoloID);
