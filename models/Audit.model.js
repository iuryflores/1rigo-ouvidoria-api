import { Schema, model } from "mongoose";

const AuditSchema = new Schema(
  {
    entidade: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    operacao: {
      type: String,
      required: true,
    },
    protocolo_id: {
      type: Schema.Types.ObjectId,
      ref: "Protocolo",
    },
    complaint_id: {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    userName: {
      type: "String",
      required: true,
    },
  },
  { timestamps: true }
);
export default model("Audit", AuditSchema);
