import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const { bookmarked } = req.query;

    const aggregation = [
      // Lookup bookmarks first
      {
        $lookup: {
          from: "bookmarkremedies",
          localField: "_id",
          foreignField: "remedyId",
          as: "bookmarkInfo",
        },
      },
      // Lookup symptoms while preserving order
      {
        $lookup: {
          from: "symptoms",
          let: { symptomIds: "$symptoms" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$symptomIds"] },
              },
            },
            {
              $addFields: {
                __order: { $indexOfArray: ["$$symptomIds", "$_id"] },
              },
            },
            { $sort: { __order: 1 } },
          ],
          as: "symptomsData",
        },
      },
      // Add computed fields
      {
        $addFields: {
          isBookmarked: { $gt: [{ $size: "$bookmarkInfo" }, 0] },
          symptoms: {
            $map: {
              input: "$symptomsData",
              as: "symptom",
              in: {
                _id: "$$symptom._id",
                name: "$$symptom.name",
              },
            },
          },
        },
      },
      // Remove temporary fields
      { $unset: ["bookmarkInfo", "symptomsData"] },
    ];

    if (bookmarked === "true") {
      aggregation.push({ $match: { isBookmarked: true } });
    }

    const remedies = await Remedy.aggregate(aggregation);
    res.status(200).json(remedies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch remedies" });
  }
}
