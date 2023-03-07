import { Router } from "express";
import Ouvidoria from "../models/Ouvidoria.model.js";
import ProtocoloOuvidoria from "../models/ProtocoloOuvidoria.model.js";
import Audit from "../models/Audit.model.js";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
const router = Router();

const user = process.env.EMAIL_CENTRAL;
const pass = process.env.PASS_CENTRAL;
//Get all Ouvidoria
router.get("/", async (req, res, next) => {
  try {
    const allOuvidoria = await Ouvidoria.find();
    res.status(200).json({ msg: "Working" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Post Ouvidoria
router.post("/add-ouvidoria/tipos/:tipo", async (req, res, next) => {
  const { tipo } = req.params;

  const {
    name,
    email,
    telephone,
    details,

    prevProtocolo,
    password,
    agreement,
  } = req.body;
  const { body } = req;

  try {
    if (!agreement || !tipo || !details) {
      return res.status(400).json({
        msg: "É obrigatório descrever a manifestação em detalhes, e aceitar o termo de ciência acima!",
      });
    }

    const lastComplaint = await Ouvidoria.find()
      .sort({ protocolo_id: -1 })
      .limit(1);

    if (lastComplaint.length > 0) {
      const lastID = lastComplaint[0].protocolo_id;
      const nextID = lastID + 1;

      const newOuvidoria = await Ouvidoria.create({
        ...body,
        protocolo_id: nextID,
      });
      console.log("Ouvidoria created successfully");

      const { _id } = newOuvidoria._id;
      const newAudit = await Audit.create({
        descricao: "Cadastrou uma manifestação",
        entidade: "ouvidoria",
        operacao: "CADASTRAR",
        userName: name || "Anônimo",
        complaint_id: newOuvidoria._id,
      });
      if (!newAudit) {
        return res
          .status(400)
          .json({ msg: "Não foi possivel criar a auditoria." });
      }

      const newProtocolo = await ProtocoloOuvidoria.create({
        protocolo_id: nextID,
        protocolo_pass: password,
        ouvidoria_ID: _id,
      });

      if (!newProtocolo) {
        return res
          .status(400)
          .json({ msg: "Não foi possivel criar o protocolo." });
      }

      await Ouvidoria.findByIdAndUpdate(
        { _id: newOuvidoria._id },
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
              from: `Canal de Ouvidoria <${user}>`,
              to: email,
              replyTo: user,
              subject: "Sistema Ouvidoria 1RIGO",
              html: `
            <h3>Manifestação registrada com sucesso!!!</h3>
            <p>Prezado(a) usuário(a),</p>
            <p>Confira em nosso Canal de Ouvidoria 1RIGO, através do número do protocolo e da senha de acesso, as atualizações. Para mais informações, entre em contato pelo WhatsApp (62) 3956-7600.</p>
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
        console.log("Manifestação anônima.");
      }
      res.status(201).json(newOuvidoria);
    } else {
      const nextID = 1;

      const newOuvidoria = await Ouvidoria.create({
        ...body,
        protocolo_id: nextID,
      });

      console.log("Ouvidoria created successfully");
      const { _id } = newOuvidoria._id;
      /*
      let chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ!@$^*+?";
      let passwordLength = 10;
      let password = "";

      for (let i = 0; i < passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
      }
*/
      const newAudit = await Audit.create({
        descricao: "Cadastrou uma manifestação",
        entidade: "ouvidoria",
        operacao: "CADASTRAR",
        userName: name || "Anônimo",
        complaint_id: newOuvidoria._id,
      });
      if (!newAudit) {
        return res
          .status(400)
          .json({ msg: "Não foi possivel criar a auditoria." });
      }
      const newProtocolo = await ProtocoloOuvidoria.create({
        protocolo_id: 1,
        protocolo_pass: password,
        ouvidoria_ID: _id,
      });

      if (!newProtocolo) {
        return res
          .status(400)
          .json({ msg: "não foi possivel criar o protocolo." });
      }
      await Ouvidoria.findByIdAndUpdate(
        { _id: newOuvidoria._id },
        { audits: newAudit._id },
        { new: true }
      );
      return res.status(201).json(newProtocolo);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Couldn't create ouvidoria!" });
  }
});

export default router;
