import dbConnect from "@/db/connect";
import { BookmarkRemedy } from "@/db/models/BookmarkRemedy";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (dbError) {
    console.error("Database connection error:", dbError);
    res.status(500).json({
      status: "Database connection failed",
      error: "DB_CONNECTION_ERROR",
    });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({
      status: "Unauthorized",
      error: "LOGIN_REQUIRED",
    });
  }

  const userId = session.user.id;

  try {
    if (req.method === "GET") {
      const bookmarkRemedies = await BookmarkRemedy.find({
        user: userId,
      }).populate("remedy");

      res.status(200).json(bookmarkRemedies);
      return;
    }
  } catch (GetError) {
    console.error(GetError);
    res.status(404).json({
      status: "Failed to fetch bookmark",
      error: "BOOKMARK_NOT_FOUND",
    });
    return;
  }
  try {
    if (req.method === "POST") {
      const { remedy } = req.body;
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const remedyObjectId = new mongoose.Types.ObjectId(remedy);
      await BookmarkRemedy.create({
        user: userObjectId,
        remedy: remedyObjectId,
      });
      res.status(201).json({ status: "Remedy bookmark created" });
      return;
    }
  } catch (createError) {
    res.status(500).json({
      status: "Failed to create bookmark",
      error: "CREATE_OPERATION_FAILED",
    });
    return;
  }

  return res.status(405).json({
    status: "Method not allowed",
    allowedMethods: ["GET", "POST"],
    error: "METHOD_NOT_ALLOWED",
  });
}
