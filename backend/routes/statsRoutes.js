import express from "express";

import Child from "../models/Child.js";
import Donation from "../models/Donation.js";
import Member from "../models/Member.js";
import Message from "../models/Message.js";
import Report from "../models/Report.js";
import Staff from "../models/Staff.js";
import CharityWeek from "../models/CharityWeek.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [
      totalChildren,
      fullySponsoredChildren,
      totalStaff,
      totalMembers,
      totalReports,
      unreadMessages,
      totalDonations,
      donationTotals,
      activeCharityWeek,
    ] = await Promise.all([
      Child.countDocuments(),

      Child.countDocuments({
        status: "sponsored",
      }),

      Staff.countDocuments(),

      Member.countDocuments(),

      Report.countDocuments(),

      Message.countDocuments({
        read: false,
      }),

      Donation.countDocuments(),

      Donation.aggregate([
        {
          $group: {
            _id: null,
            totalRaised: {
              $sum: "$amount",
            },
          },
        },
      ]),

      CharityWeek.findOne({
        status: "active",
      }).lean(),
    ]);

    const totalRaised = Number(
      donationTotals[0]?.totalRaised || 0
    );

    res.status(200).json({
      success: true,

      totalChildren,

      fullySponsoredChildren,

      totalRaised,

      totalDonations,

      totalStaff,

      totalMembers,

      totalReports,

      unreadMessages,

      activeCharityWeek,
    });
  } catch (error) {
    console.error("GET /api/stats ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
      error: error.message,
    });
  }
});

export default router;