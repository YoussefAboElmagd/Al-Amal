import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import cors from "cors";
import DBConnection from "./database/DBConnection.js";
app.use(express.static("uploads"))
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

DBConnection();

// ROUTERS
app.all("/", (req, res) => {
  res.json({
    message:
      "hello, welcome to my API!",
  });
});

import usersRouter from "./src/modules/users/users.routes.js";
import authRouter from "./src/modules/auth/auth.routes.js";
import invoiceRouter from "./src/modules/invoices/invoice.routes.js";
import paymentRouter from "./src/modules/Payments/payment.routes.js";
import notiticationRouter from "./src/modules/Notification/notification.routes.js";
import transRouter from "./src/modules/Trans/trans.routes.js";
import visitRouter from "./src/modules/Visits/visits.routes.js";

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/invoice", invoiceRouter);
app.use("/payment", paymentRouter);
app.use("/notification", notiticationRouter);
app.use("/trans", transRouter);
app.use("/visit", visitRouter);

app.all("*", (req, res, next) => {
  res
    .status(404)
    .json({ message: "Route not found! Switch to another path please!" });
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server is running on port ${process.env.PORT || 8000}!`)
);
