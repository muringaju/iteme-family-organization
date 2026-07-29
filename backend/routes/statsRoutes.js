import express from "express";
import { db } from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  await db.read();
  const {
    children,
    staff,
    members,
    donations,
    reports,
    charityWeeks,
    messages,
  } = db.data;

  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const sponsoredChildren = children.filter((c) => Number(c.amountRaised || 0) >= Number(c.feeNeeded || 0) && Number(c.feeNeeded || 0) > 0).length;
  const unreadMessages = messages.filter((m) => !m.read).length;
  const activeCharityWeek = charityWeeks.find((cw) => cw.status === "active");

  res.json({
    totalChildren: children.length,
    fullySponsoredChildren: sponsoredChildren,
    totalStaff: staff.length,
    totalMembers: members.length,
    totalDonations: donations.length,
    totalRaised,
    totalReports: reports.length,
    totalCharityWeeks: charityWeeks.length,
    activeCharityWeek: activeCharityWeek || null,
    unreadMessages,
  });
});

export default router;
