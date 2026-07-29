import { v4 as uuid } from "uuid";
import { initDB, db } from "../config/db.js";

async function seed() {
  await initDB();
  await db.read();

  if (db.data.children.length === 0) {
    db.data.children.push(
      {
        id: uuid(),
        fullName: "Uwase Diane",
        age: 12,
        grade: "Primary 6",
        district: "Nyarugenge",
        story:
          "Diane lives with her grandmother after losing both parents. She dreams of becoming a nurse and walks two hours to school every day.",
        feeNeeded: 120000,
        amountRaised: 45000,
        status: "urgent",
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        fullName: "Nkurunziza Eric",
        age: 15,
        grade: "Senior 2",
        district: "Musanze",
        story:
          "Eric's mother is a widow supporting five children through subsistence farming. He excels in mathematics and hopes to become an engineer.",
        feeNeeded: 180000,
        amountRaised: 180000,
        status: "sponsored",
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        fullName: "Mukamana Josiane",
        age: 9,
        grade: "Primary 3",
        district: "Huye",
        story:
          "Josiane's family lost their home in seasonal flooding. She loves to sing and is determined to keep attending school despite the setback.",
        feeNeeded: 95000,
        amountRaised: 20000,
        status: "urgent",
        createdAt: new Date().toISOString(),
      }
    );
  }

  if (db.data.staff.length === 0) {
    db.data.staff.push(
      {
        id: uuid(),
        name: "Iteme Jean Baptiste",
        role: "Executive Director",
        bio: "Founded Iteme of Hope Family Organization in 2015 to help vulnerable families become self-reliant through education.",
        email: "director@itemeofhope.org",
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: "Uwimana Grace",
        role: "Programs Coordinator",
        bio: "Oversees the sponsorship program and coordinates directly with schools and families.",
        email: "programs@itemeofhope.org",
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: "Habimana Patrick",
        role: "Finance & Reports Officer",
        bio: "Manages donations, financial transparency and annual reporting.",
        email: "finance@itemeofhope.org",
        createdAt: new Date().toISOString(),
      }
    );
  }

  if (db.data.members.length === 0) {
    db.data.members.push(
      {
        id: uuid(),
        name: "Mugisha Alain",
        membershipType: "Volunteer",
        joinedDate: "2023-02-10",
        contact: "alain@example.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: "Ingabire Claudine",
        membershipType: "Community Partner",
        joinedDate: "2022-11-04",
        contact: "claudine@example.com",
        createdAt: new Date().toISOString(),
      }
    );
  }

  if (db.data.charityWeeks.length === 0) {
    db.data.charityWeeks.push({
      id: uuid(),
      title: "Back-to-School Charity Week 2026",
      theme: "Every Child Deserves a Desk",
      startDate: "2026-08-10",
      endDate: "2026-08-17",
      goalAmount: 5000000,
      raisedAmount: 1250000,
      status: "active",
      description:
        "A week dedicated to raising school fees, uniforms, and supplies for vulnerable students before the new term begins.",
      createdAt: new Date().toISOString(),
    });
  }

  if (db.data.reports.length === 0) {
    db.data.reports.push({
      id: uuid(),
      title: "2025 Annual Impact Report",
      year: "2025",
      summary:
        "In 2025 Iteme of Hope Family Organization supported 84 vulnerable students with school fees and helped 12 families launch small income-generating projects.",
      fileUrl: "",
      createdAt: new Date().toISOString(),
    });
  }

  if (db.data.donations.length === 0) {
    db.data.donations.push(
      { id: uuid(), donorName: "Anonymous Donor", amount: 50000, currency: "RWF", method: "Mobile Money", status: "confirmed", createdAt: new Date().toISOString() },
      { id: uuid(), donorName: "Kigali Rotary Club", amount: 400000, currency: "RWF", method: "Bank Transfer", status: "confirmed", createdAt: new Date().toISOString() }
    );
  }

  await db.write();
  console.log("Demo data seeded successfully.");
  process.exit(0);
}

seed();
z