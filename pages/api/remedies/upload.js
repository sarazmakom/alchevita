import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_MB = parseInt(process.env.MAX_UPLOAD_SIZE_MB, 10) || 2;
const MAX_FILESIZE = MAX_MB * 1024 * 1024;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = formidable({ maxFileSize: MAX_FILESIZE });

  form.parse(req, async (err, fields, files) => {
    if (err && err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(413)
        .json({ message: `File too large. Max size is ${MAX_MB} MB.` });
    }
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ message: "Upload failed" });
    }

    let file = files.image;
    if (Array.isArray(file)) {
      file = file[0];
    }

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // mime‑type guard
    const mimetype = file.mimetype || file.type || "";
    if (!mimetype.startsWith("image/")) {
      fs.unlink(file.filepath, () => {});
      return res
        .status(415)
        .json({ message: "Unsupported file type. Please upload an image." });
    }

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: "remedies",
      });
      return res.status(200).json({ imageUrl: result.secure_url });
    } catch (uploadErr) {
      console.error("Cloudinary error:", uploadErr);
      return res.status(500).json({ message: "Cloudinary upload failed" });
    } finally {
      fs.unlink(file.filepath, () => {});
    }
  });
}
