import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    descricao: { type: "String", required: true },
    userName: { type: "String", required: true, default: "Anônimo" },
    complaint_id: {
      type: Schema.Types.ObjectId,
      ref: "Complaint"
    }
  },
  { timestamps: true }
);
export default model("Message", messageSchema);
