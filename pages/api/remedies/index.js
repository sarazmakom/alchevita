import dbConnect from "@/db/connect";
import { Remedy } from "@/db/models/Remedy";
import { Symptom } from "@/db/models/Symptom";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  try {
    await dbConnect();

    if (req.method !== "GET") {
      return res.status(405).json({ status: "Method not allowed!" });
    }

    const { bookmarked, symptom } = req.query;

    // Handle symptom filtering first
    let symptomFilter = {};
    if (symptom) {
      const symDoc = await Symptom.findOne({ name: symptom });
      if (!symDoc) return res.status(200).json([]);
      symptomFilter = { symptoms: symDoc._id };
    }

    // Base aggregation pipeline
    const aggregation = [
      { $match: symptomFilter }, // Apply symptom filter here
      {
        $lookup: {
          from: "bookmarkremedies",
          let: { remedyId: "$_id" },
          pipeline: userId
            ? [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$remedy", "$$remedyId"] },
                        { $eq: ["$user", new ObjectId(userId)] },
                      ],
                    },
                  },
                },
              ]
            : [],
          as: "bookmarkInfo",
        },
      },
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
            {
              $sort: { __order: 1 },
            },
          ],
          as: "symptomsData",
        },
      },
      {
        $addFields: {
          isBookmarked: { $gt: [{ $size: "$bookmarkInfo" }, 0] },
          symptoms: {
            $map: {
              input: "$symptomsData",
              as: "symptom",
              in: { _id: "$$symptom._id", name: "$$symptom.name" },
            },
          },
        },
      },
      { $unset: ["bookmarkInfo", "symptomsData"] },
    ];

    // Add bookmarked filter if needed
    if (bookmarked === "true") {
      aggregation.push({ $match: { isBookmarked: true } });
    }
    aggregation.push({ $sort: { _id: -1 } }); // sorted by id

    const remedies = await Remedy.aggregate(aggregation);
    return res.status(200).json(remedies);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      status: "Server Error",
      error: error.message || "Failed to process request",
    });
  }
}
