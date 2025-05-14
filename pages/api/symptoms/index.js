import dbConnect from "@/db/connect";
import { Symptom } from "@/db/models/Symptom";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const symptoms = await Symptom.find().sort({ name: 1 }); //sorted by name
      return res.status(200).json(symptoms);
    } catch (error) {
      return res.status(400).json({
        status: `failed to fetch symptoms: ${error}`,
      });
    }
  }
  res.status(405).json({ status: "method not allowed!" });
}
