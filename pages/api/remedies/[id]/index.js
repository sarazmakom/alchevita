import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    const remedy = await Remedy.findById(id).populate("symptoms");

    if (!remedy) {
      res.status(404).json({ status: "Not found" });
      return;
    }

    res.status(200).json(remedy);
    return;
  }

  res.status(405).json({ status: "method not allowed!" });
}
