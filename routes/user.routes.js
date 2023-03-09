import { Router } from "express";
import User from "../models/User.model.js";
import * as dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

//Get users Denuncias
router.get("/users", async (req, res, next) => {
  console.log(req.body);
  try {
    const allUsers = await User.findAll({ entidade: entidade });
    return res.status(200).json(allUsers);
  } catch (error) {
    next();
  }
});
//Get users Ouvidoria
router.get("/ouvidoria/users", async (req, res, next) => {
  try {
    const allUsers = await User.find({ entidade: "ouvidoria" });
    return res.status(200).json(allUsers);
  } catch (error) {
    next();
  }
});
router.get("/user/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const allUsers = await User.find({ _id: id });
    return res.status(200).json(allUsers);
  } catch (error) {
    next();
  }
});
//Create User
router.post("/user/auth/signup", async (req, res, next) => {
  //Get data from body
  let { full_name, email, password, cpf, entidade } = req.body;

  //Check if all fields are filled
  if (!full_name || !email || !password || !cpf) {
    return res.status(400).json({ msg: "Todos os campos são obrigatórios!" });
  }

  //Check if is a valid email
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Seu email não é válido." });
  }

  //Try to add user
  try {
    //Check if user exists
    const foudedUser = await User.findOne({ email, entidade });
    if (foudedUser) {
      return res.status(400).json({
        msg: `Já existe um usuário com este email "${foudedUser.email}"!`,
      });
    }

    //Generate passwordHash
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    //Create new user

    const newUser = await User.create({
      full_name,
      email,
      passwordHash,
      cpf,
      entidade,
    });

    //Get id from newUser
    const { _id } = newUser;

    return res.status(201).json({ full_name, email, _id, entidade });
  } catch (error) {
    next(error);
  }
});

//Login
router.post("/user/auth/login", async (req, res, next) => {
  const { email, password, entidade } = req.body;
  console.log(entidade);
  const status = true;
  try {
    //Look for user by email
    const user = await User.findOne({ email, entidade });
    console.log(user);
    if (user.status !== true) {
      return res
        .status(400)
        .json({ status: 401, msg: "Usuário não autorizado" });
    }
    //Check if email was fouded
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    //Compare the password if matchs
    const compareHash = bcrypt.compareSync(password, user.passwordHash);

    //Check if the password is wrong
    if (!compareHash) {
      return res.status(400).json({ msg: "Email ou senha são inválidos." });
    }

    const payload = {
      id: user._id,
      email: user.email,
      entidade: user.entidade,
    };

    //Create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.status(200).json({ ...payload, token });
  } catch (error) {
    console.log("error");
    next(error);
  }
});
export default router;
