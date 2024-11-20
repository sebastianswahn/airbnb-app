// pages/api/listings/[id].ts
import dbConnect from "../../../../utils/db";
import Listing from "../../../../models/listing";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  await dbConnect();

  if (req.method === "GET") {
    try {
      const listing = await Listing.findById(id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.status(200).json(listing);
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch listing" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
