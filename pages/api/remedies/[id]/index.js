import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";
import mongoose from "mongoose";

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
    try {
      await Remedy.findByIdAndDelete(id);
      return res.status(200).json({ status: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete remedy" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { title, ingredients, preparation, usage, symptoms, imageUrl } =
        req.body;

      if (!title || !ingredients?.length || !symptoms?.length) {
        return res.status(400).json({ status: "Missing required fields" });
      }

      const updatedRemedy = await Remedy.findByIdAndUpdate(
        id,
        {
          title,
          ingredients,
          preparation,
          usage,
          symptoms,
          imageUrl,
        },
        { new: true }
      ).populate("symptoms");

      if (!updatedRemedy) {
        return res.status(404).json({ status: "Remedy not found" });
      }

      return res.status(200).json(updatedRemedy);
    } catch (error) {
      console.error("Update Remedy Error:", error);
      return res.status(500).json({
        status: "Server Error",
        error: error.message || "Failed to update remedy",
      });
    }
  }

  res.status(405).json({ status: "Method not allowed!" });
}
