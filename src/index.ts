import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger, httpLogger } from "@/utils/logger.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import { nanoid } from "nanoid";
import fs from "node:fs";
import sharp from "sharp";
import { encode } from "blurhash";
import { pool } from "@/db/client.js";
import { authRouter } from "@/routes/auth.routes.js";
import { env } from "@/env.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", (req, res) => {
  // Collect chunks of data
  const form = formidable({
    multiples: true,
    maxFieldsSize: 5 * 1024 * 1024,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error", err);
      return res.status(500);
    }
    const fileArray = Array.isArray(files.images)
      ? files.images
      : files.images
      ? [files.images]
      : [];

    try {
      const uploadResults = await Promise.all(
        fileArray.map(async (file) => {
          // Generate unique filename preserving extension

          const fileName = `${nanoid()}.webp`;
          console.log(fileName);
          // Read file buffer
          const fileBuffer = await fs.promises.readFile(file.filepath);
          const webpBuffer = await sharp(fileBuffer).webp().toBuffer();

          const { data, info } = await sharp(webpBuffer)
            .raw()
            .ensureAlpha()
            .resize(32, 32, { fit: "inside" })
            .toBuffer({ resolveWithObject: true });

          const blurHash = encode(
            new Uint8ClampedArray(data),
            info.width,
            info.height,
            4,
            4
          );
          console.log(blurHash);
          try {
            // Upload to S3
            const command = new PutObjectCommand({
              Bucket: "merapyaraawskabucket",
              Key: fileName,
              Body: webpBuffer,
              ContentType: "image/webp",
              ACL: "public-read",
            });

            await s3Client.send(command);

            // Optional: Clean up temp file
            await fs.promises.unlink(file.filepath);

            return {
              originalName: file.originalFilename,
              fileName: fileName,

              mimeType: file.mimetype,
              size: file.size,
            };
          } catch (s3Error) {
            console.error("S3 Upload Error:", s3Error);
            return {
              originalName: file.originalFilename,
              error: "Upload to S3 failed",
            };
          }
        })
      );

      res.status(200).json({
        message: "Uploads successful",
        uploads: uploadResults,
      });
    } catch (error) {
      console.error("Upload Errpor:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
});
app.use("/api/auth", authRouter);

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
