import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await dbConnect();
      const { title, ingredients, preparation, usage, symptoms } = req.body;
      if (!title || !ingredients?.length || !symptoms?.length) {
        return res.status(400).json({ status: "Missing required fields" });
      }
      const DEFAULT_IMAGE_URL =
        "https://via.placeholder.com/600x400?text=No+Image";
      const newRemedy = await Remedy.create({
        title,
        imageUrl: req.body.imageUrl || DEFAULT_IMAGE_URL,
        ingredients,
        preparation,
        usage,
        symptoms,
      });
      return res.status(200).json(newRemedy);
    } catch (error) {
      console.error("Create Remedy Error:", error);
      return res.status(500).json({
        status: "Server Error",
        error: error.message || "Failed to create remedy",
      });
    }
  }
  return res.status(405).json({ status: "Methode not allowed!" });
}
