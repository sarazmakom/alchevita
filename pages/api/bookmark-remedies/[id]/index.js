import dbConnect from "@/db/connect";
import { BookmarkRemedy } from "@/db/models/BookmarkRemedy";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "DELETE") {
    await BookmarkRemedy.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ status: `Bookmarked remedy with id: ${id} is deleted` });
  }

  res.status(405).json({ status: "method not allowed!" });
}
