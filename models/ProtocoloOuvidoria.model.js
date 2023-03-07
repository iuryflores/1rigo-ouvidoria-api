import { Schema, model } from "mongoose";

const protocoloOuvidoria = new Schema(
  {
    protocolo_id: { type: Number, required: true },
    protocolo_pass: { type: String, required: true, unique: false },
    ouvidoria_ID: {
      type: Schema.Types.ObjectId,
      ref: "Ouvidoria",
    },
  },
  { timestamps: true }
);
export default model("ProtocoloOuvidoria", protocoloOuvidoria);
