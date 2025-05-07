import dbConnect from "@/db/connect";
import { BookmarkRemedy } from "@/db/models/BookmarkRemedy";
import mongoose from "mongoose";

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

  if (req.method === "DELETE") {
    try {
      const deletedBookmark = await BookmarkRemedy.findOneAndDelete({
        remedyId: remedyId,
      });

      if (!deletedBookmark) {
        return res.status(404).json({
          status: "Bookmark not found",
          error: "NOT_FOUND",
        });
      }

      return res.status(200).json({
        status: "Bookmark successfully deleted",
        deletedId: deletedBookmark._id,
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
