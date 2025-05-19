import formidable from "formidable";
import fs from "fs";
import cloudinary from "@/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_MB = parseInt(process.env.MAX_UPLOAD_SIZE_MB, 10) || 2;
const MAX_FILESIZE = MAX_MB * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = formidable({ maxFileSize: MAX_FILESIZE });

  // Wrap parse in a promise so Next.js waits until we send a response
  await new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      // File size too large
      if (err && err.code === "LIMIT_FILE_SIZE") {
        res
          .status(413)
          .json({ message: `File too large. Max size is ${MAX_MB} MB.` });
        return resolve();
      }

      if (err) {
        console.error("Form parse error:", err);
        res.status(500).json({ message: "Upload failed" });
        return resolve();
      }

      let file = files.image;
      if (Array.isArray(file)) {
        file = file[0];
      }

      if (!file) {
        res.status(400).json({ message: "No file provided" });
        return resolve();
      }

      const mimetype = file.mimetype || file.type || "";
      if (!mimetype.startsWith("image/")) {
        fs.unlink(file.filepath, () => {});
        res
          .status(415)
          .json({ message: "Unsupported file type. Please upload an image." });
        return resolve();
      }

      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          folder: "remedies",
        });
        res.status(200).json({ imageUrl: result.secure_url });
      } catch (uploadErr) {
        console.error("Cloudinary error:", uploadErr);
        res.status(500).json({ message: "Cloudinary upload failed" });
      } finally {
        fs.unlink(file.filepath, () => {});
        return resolve();
      }
    });
  });
}
