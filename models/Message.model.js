import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    descricao: { type: "String"},
    userName: { type: "String", required: true, default: "Anônimo" },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    complaint_id: {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
    },
  },
  { timestamps: true }
);
export default model("Message", messageSchema);
