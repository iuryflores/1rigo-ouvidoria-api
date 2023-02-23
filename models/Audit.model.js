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
      required: true,
    },
    complaint_id: {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);
