import { Router } from "express";
import Complaint from "../models/Complaint.model.js";
import ProtocoloID from "../models/ProtocoloID.model.js";
import Audit from "../models/Audit.model.js";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
const router = Router();

const user = process.env.EMAIL_CENTRAL;
const pass = process.env.PASS_CENTRAL;
//Get all complaint
router.get("/", async (req, res, next) => {
  try {
    const allComplaint = await Complaint.find();
    res.status(200).json({ msg: "Working" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Post complaint
router.post("/add-complaint/:category", async (req, res, next) => {
  const { category } = req.params;
  const {
    name,
    role,
    email,
    telephone,
    sector,
    involved,
    witness,
    talkedAbout,
    details,
    previousComplaint,
    password,
    agreement,
  } = req.body;
  const { body } = req;

  try {
    if (!agreement || !category || !sector) {
      return res.status(400).json({
        msg: "É obrigatório selecionar um departamento, e aceitar o termo de ciência acima!",
      });
    }
    if (sector === "Selecione um departamento") {
      return res
        .status(400)
        .json({ msg: "É necessário selecionar um departamento" });
    }
    const lastComplaint = await Complaint.find()
      .sort({ protocolo_id: -1 })
      .limit(1);

    if (lastComplaint.length > 0) {
      const lastID = lastComplaint[0].protocolo_id;
      const nextID = lastID + 1;

      const newComplaint = await Complaint.create({
        ...body,
        protocolo_id: nextID,
      });
      console.log("Complaint created successfully");

      const { _id } = newComplaint._id;
      const newAudit = await Audit.create({
        descricao: "Cadastrou uma denúncia",
        entidade: "denúncia",
        operacao: "CADASTRAR",
        userName: name || "Anônimo",
        complaint_id: newComplaint._id,
      });
      if (!newAudit) {
        return res
          .status(400)
          .json({ msg: "não foi possivel criar a auditoria." });
      }

      const newProtocolo = await ProtocoloID.create({
        protocolo_id: nextID,
        protocolo_pass: password,
        complaint_ID: _id,
      });

      if (!newProtocolo) {
        return res
          .status(400)
          .json({ msg: "não foi possivel criar o protocolo." });
      }

      await Complaint.findByIdAndUpdate(
        { _id: newComplaint._id },
        { audits: newAudit._id },
        { new: true }
      );
      //Send email if not anonymous
      if (email) {
        const sendEmail = (newProtocolo) => {
          const transporter = nodemailer.createTransport({
            host: "email-ssl.com.br",
            port: 465,
            auth: { user, pass },
          });

          transporter
            .sendMail({
              from: `Canal de Denúncia <${user}>`,
              to: email,
              replyTo: user,
              subject: "Sistema Ouvidoria - Teste",
              html: `
            <h3>Denúncia registrada com sucesso!!!</h3>
            <p>Prezado(a) usuário(a),</p>
            <p>Confira em nosso Canal de Denúncia, através do número do protocolo e da senha de acesso, as atualizações. Para mais informações, entre em contato pelo WhatsApp (62) 3956-7600.</p>
            <p>Protocolo n: <b> ${newProtocolo.protocolo_id}</b><br />
            Senha: <b>${newProtocolo.protocolo_pass}</b></p>
          `,
            })
            .then((info) => {
              console.log(info);
            })
            .catch((error) => {
              console.log(error);
            });
        };
        sendEmail(newProtocolo);
      } else {
        console.log("Denúncia anônima.");
      }
      res.status(201).json(newComplaint);
    } else {
      const newComplaint = await Complaint.create({
        ...body,
        protocolo_id: 1,
      });

      console.log("Complaint created successfully");
      const { _id } = newComplaint._id;

      let chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ!@$^*+?";
      let passwordLength = 10;
      let password = "";

      for (let i = 0; i < passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
      }

      const newProtocolo = await ProtocoloID.create({
        protocolo_id: 1,
        protocolo_pass: password,
        complaint_ID: _id,
      });

      if (!newProtocolo) {
        return res
          .status(400)
          .json({ msg: "não foi possivel criar o protocolo." });
      }

      return res.status(201).json({ protocolo: newProtocolo.nextID });
    }
  } catch (error) {
    console.log("Couldn't create complaint!");
    return res.status(400).json({ msg: "Couldn't create complaint!" });
  }
});

export default router;
