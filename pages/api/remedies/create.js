import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ status: "Method Not Allowed" });

  try {
    await dbConnect();
    const { title, ingredients, preparation, usage, symptoms, imageUrl } =
      req.body;

    if (!title || !ingredients?.length || !symptoms?.length)
      return res.status(400).json({ status: "Missing required fields" });

    const newRemedy = await Remedy.create({
      title,
      ingredients,
      preparation,
      usage,
      symptoms,
      imageUrl: imageUrl,
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
