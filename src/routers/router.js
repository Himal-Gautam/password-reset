import express from "express";
import User from "../models/user.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Auth } from "two-step-auth";

const router = new express.Router();

//send email
router.post("/users/password-reset/get-email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send({ success: false });
    } else {
      const resAuth = await Auth(
        req.body.email,
        "and resetting password. Please click the link https://password-reset-guvi.netlify.app/password-reset"
      );
      user["otp"] = resAuth.OTP;
      await user.save();
      res.status(200).send({ success: true });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

//update password
router.patch("/users/password-reset/reset", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(400)
        .send({ success: false, msg: "User not found with email" });
    } else {
      user["password"] = req.body.password;
      await user.save();
      res.status(200).send({ success: true, msg: "Task Completed" });
    }
  } catch (e) {
    res.status(400).send(e, occured);
  }
});

//confirm otp
router.post("/users/password-reset/otp", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(400)
        .send({ success: false, msg: "User not found with email" });
    } else {
      if (user.otp === req.body.otp) {
        res.status(200).send({ success: true, msg: "OTP matched" });
      } else {
        res.status(400).send({success: false, msg: "OTP didn't matched"});
      }
    }
  } catch (e) {
    res.status(400).send(e);
  }
});
export default router;
