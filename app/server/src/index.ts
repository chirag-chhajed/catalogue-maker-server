import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { authRouter } from "@/routes/auth.routes.js";
import { catalogueRouter } from "@/routes/catalogue.routes.js";
import { invitationsRouter } from "@/routes/invitation.routes.js";
import { organizationRouter } from "@/routes/organization.route.js";

import { pool } from "@/db/client.js";

import { httpLogger, logger } from "@/utils/logger.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRouter);
app.use("/api/catalogue", catalogueRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/invitation", invitationsRouter);

app.listen(3434, async () => {
  try {
    await pool.connect();
    logger.info("Connected to the database");
  } catch (error) {
    logger.error({ err: "Failed to connect to the database", error });
    process.exit(1);
  }
  logger.info(`Server started on http://localhost:3434`);
});
