import dbConnect from "@/db/connect";
import { BookmarkRemedy } from "@/db/models/BookmarkRemedy";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const { remedyId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(remedyId)) {
    return res.status(400).json({
      status: "Invalid remedy ID format",
      error: "BAD_REQUEST",
    });
  }
  try {
    await dbConnect();
  } catch (dbError) {
    console.error("Database connection error:", dbError);
    return res.status(500).json({
      status: "Database connection failed",
      error: "DB_CONNECTION_ERROR",
    });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({
      status: "Unauthorized",
      error: "LOGIN_REQUIRED",
    });
  }

  const userId = session.user.id;

  if (req.method === "DELETE") {
    try {
      const bookmark = await BookmarkRemedy.findOne({
        user: userId,
        remedy: remedyId,
      });

      if (!bookmark) {
        return res.status(404).json({
          status: "Bookmark not found or not owned by user",
          error: "NOT_FOUND",
        });
      }

      await BookmarkRemedy.findByIdAndDelete(bookmark._id);

      return res.status(200).json({
        status: "Bookmark successfully deleted",
        deletedId: bookmark._id,
      });
    } catch (deleteError) {
      console.error("Delete operation failed:", deleteError);
      return res.status(500).json({
        status: "Failed to delete bookmark",
        error: "DELETE_OPERATION_FAILED",
      });
    }
  }

  return res.status(405).json({
    status: "Method not allowed",
    allowedMethods: ["DELETE"],
    error: "METHOD_NOT_ALLOWED",
  });
}
