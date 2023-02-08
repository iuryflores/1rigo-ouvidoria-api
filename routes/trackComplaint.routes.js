import { Router } from "express";
import ProtocoloID from "../models/ProtocoloID.model.js";
import Complaint from "../models/Complaint.model.js";

const router = Router();

router.get(
  "/track-complaint/:protocolo_id/:pass_protocolo",
  async (req, res, next) => {
    const { protocolo_id, pass_protocolo } = req.params;

    try {
      const dataProtocolo = await ProtocoloID.find({
        protocolo_id: protocolo_id,
      }).populate("complaint_ID");

      console.log(dataProtocolo);
      return res.status(200).json(dataProtocolo);
    } catch (error) {
      return res.status(400).json({ msg: "Erro ao pegar dados" });
    }
  }
);

export default router;
