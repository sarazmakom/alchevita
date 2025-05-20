import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";
import mongoose from "mongoose";
import {
  extractPublicIdFromUrl,
  deleteImage,
} from "@/utils/cloudinaryDeleteUtils";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ status: "Database connection failed!" });
  }

  const { id } = req.query;

  // ─── PUBLIC READ w/ on‑the‑fly backfill ────────────────────────────────────────
  if (req.method === "GET") {
    // Validate format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "Invalid remedy ID format!" });
    }

    // Fetch the remedy
    let remedy = await Remedy.findById(id).populate("symptoms");
    if (!remedy) {
      return res.status(404).json({ status: "Remedy not found!" });
    }

    // backfill ownerId if missing *and* user is signed in
    const session = await getServerSession(req, res, authOptions);
    if (session && !remedy.ownerId) {
      remedy.ownerId = session.user.id;
      await Remedy.findByIdAndUpdate(id, { ownerId: session.user.id });
    }

    return res.status(200).json(remedy);
  }

  // ─── PROTECT DELETE & PATCH ─────────────────────────────────────────────────
  // Require valid session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ status: "Unauthorized" });
  }

  // Validate and load existing
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: "Invalid remedy ID format!" });
  }
  const existing = await Remedy.findById(id);
  if (!existing) {
    return res.status(404).json({ status: "Remedy not found" });
  }

  // Only the owner can modify
  if (existing.ownerId.toString() !== session.user.id) {
    return res.status(403).json({ status: "Forbidden" });
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  if (req.method === "DELETE") {
    await Remedy.findByIdAndDelete(id);
    if (existing.imageUrl) {
      const publicId = extractPublicIdFromUrl(existing.imageUrl);
      deleteImage(publicId);
    }
    return res.status(200).json({ status: "Deleted successfully" });
  }

  // ─── PATCH ─────────────────────────────────────────────────────────────────
  if (req.method === "PATCH") {
    const { title, ingredients, preparation, usage, symptoms, imageUrl } =
      req.body;
    if (!title || !ingredients?.length || !symptoms?.length) {
      return res.status(400).json({ status: "Missing required fields" });
    }
    const updated = await Remedy.findByIdAndUpdate(
      id,
      { title, ingredients, preparation, usage, symptoms, imageUrl },
      { new: true }
    ).populate("symptoms");
    if (!updated) {
      return res.status(500).json({ status: "Failed to update remedy" });
    }
    // Clean up old image if changed
    if (existing.imageUrl && existing.imageUrl !== imageUrl) {
      const oldId = extractPublicIdFromUrl(existing.imageUrl);
      deleteImage(oldId);
    }
    return res.status(200).json(updated);
  }

  // ─── METHOD NOT ALLOWED ────────────────────────────────────────────────────
  return res.status(405).json({ status: "Method not allowed!" });
}
