import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";
import mongoose from "mongoose";
import {
  extractPublicIdFromUrl,
  deleteImage,
} from "@/utils/cloudinaryDeleteUtils";

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error: ", error);
    return res.status(500).json({ status: "Database connection failed!" });
  }

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: "Invalid remedy ID format!" });
      }

      const remedy = await Remedy.findById(id).populate("symptoms");

      if (!remedy) {
        return res.status(404).json({ status: "Remedy not found!" });
      }
      return res.status(200).json(remedy);
    } catch (error) {
      console.error("Error fetching remedy: ", error);
      return res.status(500).json({ status: "Failed to fetch remedy!" });
    }
  }
  if (req.method === "DELETE") {
    // 1) Load existing for its imageUrl
    const existing = await Remedy.findById(id);
    if (!existing) {
      return res.status(404).json({ status: "Remedy not found" });
    }

    // 2) Delete document
    await Remedy.findByIdAndDelete(id);

    // 3) Then delete the Cloudinary asset
    const publicId = extractPublicIdFromUrl(existing.imageUrl);
    deleteImage(publicId);

    return res.status(200).json({ status: "Deleted successfully" });
  }

  if (req.method === "PATCH") {
    const { title, ingredients, preparation, usage, symptoms, imageUrl } =
      req.body;

    if (!title || !ingredients?.length || !symptoms?.length) {
      return res.status(400).json({ status: "Missing required fields" });
    }

    // 1) Load existing
    const existing = await Remedy.findById(id);
    if (!existing) {
      return res.status(404).json({ status: "Remedy not found" });
    }

    // 2) Update record
    const updated = await Remedy.findByIdAndUpdate(
      id,
      { title, ingredients, preparation, usage, symptoms, imageUrl },
      { new: true }
    ).populate("symptoms");

    if (!updated) {
      return res.status(500).json({ status: "Failed to update remedy" });
    }

    // 3) If the image changed, trigger deletion of the old asset
    if (existing.imageUrl && existing.imageUrl !== imageUrl) {
      const oldPublicId = extractPublicIdFromUrl(existing.imageUrl);
      deleteImage(oldPublicId); // fire-and-forget
    }

    return res.status(200).json(updated);
  }

  res.status(405).json({ status: "Method not allowed!" });
}
