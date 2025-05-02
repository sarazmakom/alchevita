import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const remedies = await Remedy.find();
      return res.status(200).json(remedies);
    } catch (error) {
      return res.status(400).json({
        status: `failed to fetch remedies: ${error}`,
      });
    }
  }
  res.status(405).json({
    status: "method not allowed!",
  });
}
