import dbConnect from "@/db/connect";
import { BookmarkRemedy } from "@/db/models/BookmarkRemedy";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const bookmarkRemedies = await BookmarkRemedy.find();

    res.status(200).json(bookmarkRemedies);
    return;
  }

  if (req.method === "POST") {
    const bookmarkRemedyData = req.body;

    await BookmarkRemedy.create(bookmarkRemedyData);

    res.status(201).json({ status: "Remedy bookmark created" });
    return;
  }

  res.status(405).json({ status: "method not allowed!" });
}
