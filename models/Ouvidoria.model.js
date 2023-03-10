import { Schema, model } from "mongoose";

const ouvidoriaSchema = new Schema(
  {
    tipo: { type: String, required: [true, "Tipo is required!"] },
    etapa: { type: String, required: true, default: "ouvidoria" },

    details: String,
    prevProtocolo: Number,
    agreement: { type: Boolean, required: [true, "Agreement is required!"] },
    name: String,

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
    responsible_name: { type: "String" },
    audits: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audit",
      },
    ],
    messages_id: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

export default model("Ouvidoria", ouvidoriaSchema);
