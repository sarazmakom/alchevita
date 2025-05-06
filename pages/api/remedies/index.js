import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";
import { Symptom } from "@/db/models/Symptom";

export default async function handler(req, res) {
  await dbConnect();
  ///////////////////
  const {
    method,
    query: { symptom },
  } = req;
  //////////////////
  if (req.method === "GET") {
    try {
      /////////////////////////////////////////////////////
      const filter = symptom ? { symptoms: symptom } : {};
      /////////////////////////////////////////////////////

      const remedies = await Remedy.find(filter).populate({
        path: "symptoms",
        model: Symptom, // Explicitly state the model
      });
      return res.status(200).json(remedies);
    } catch (error) {
      return res.status(400).json({
        status: `failed to fetch remedies: ${error}`,
      });
    }
  }
  res.status(405).json({ status: "method not allowed!" });
}
