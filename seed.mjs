/**
 * Sanity Seed Script
 * Run: node seed.mjs
 *
 * Creates dummy data for all content types:
 *  - testimonial (6 docs)
 *  - event (6 docs)
 *  - currentNeed (6 docs)
 *  - faq (10 docs)
 *  - contactInfo (1 singleton)
 *  - teamMember (2 docs)
 *  - foundingStory (1 singleton)
 *  - serviceArea (7 docs)
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = "u32ec3wv";
const DATASET = "production";
const TOKEN = "sk9PF6PWhmu7q93rkuvEGZMgUxnJ2xNjxqr5ESKnRtJwjnVjhNjH2UZLhwVicC3OEASHaf3AK3YHpv9DzJet6s5Fvk6hBiTM10SxFh5RGCVJTSGxBa73tscbFDO1a3Fvf5lkPKrFLiMFSwzNjLjFaDo2bNzWAVkc0WTIIIXthzyW5ZdI90eU";

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ─── Team Members ─────────────────────────────────────────────────────────────
const teamMembers = [
  {
    _type: "teamMember",
    name: "Amina Hassan",
    title: "Co-Founder & Executive Director",
    bio: "Dedicated to refugee advocacy and community empowerment for over a decade, Amina leads global partnership operations and oversees all resettlement program strategy. Her background in international social work and grassroots organizing has shaped Bridge Global Network's commitment to dignity-first service delivery.",
    email: "contact@globalbridgesnetwork.org",
    linkedin: "https://linkedin.com/company/global-bridges-network",
    order: 1,
    published: true,
  },
  {
    _type: "teamMember",
    name: "Fatou Diallo",
    title: "Co-Founder & Director of Programs",
    bio: "Passionate about health navigation, overseas women's micro-grants, and educational development, Fatou directs field operations and community integration services. She brings a decade of experience working with international NGOs across East Africa and Southeast Asia.",
    email: "info@globalbridgesnetwork.org",
    linkedin: "https://linkedin.com/company/global-bridges-network",
    order: 2,
    published: true,
  },
];

// ─── Founding Story (singleton) ───────────────────────────────────────────────
const foundingStory = {
  _id: "foundingStory",
  _type: "foundingStory",
  paragraphs: [
    "Bridge Global Network was founded out of a shared commitment to bridge the gap between initial crisis arrival and long-term community integration. Recognizing the complex obstacles faced by incoming refugee families and immigrants — from housing displacement to healthcare navigation — our founders established a holistic support network designed to treat every individual with dignity and cultural respect.",
    "Expanding beyond local resettlement services, our organization partnered directly with grassroots leaders overseas to launch targeted women empowerment programs, equipping women with micro-grants, vocational skills, and leadership tools. What began as a small volunteer-driven effort in Chicago has grown into an international platform that connects communities across borders.",
    "Today, Bridge Global Network continues to be driven by its original conviction: that every person — regardless of where they were born or how they arrived — deserves the opportunity to build a safe, dignified, and self-sufficient life.",
  ],
};

// ─── Service Areas ─────────────────────────────────────────────────────────────
const serviceAreas = [
  { _type: "serviceArea", title: "Refugee & Immigrant Support", description: "Welcoming newly arrived individuals and families with compassionate community orientation and personalized support.", icon: "Users", order: 1, published: true },
  { _type: "serviceArea", title: "Resettlement Services", description: "Assisting with secure initial housing, essential household items, neighborhood orientation, and family logistics.", icon: "Building2", order: 2, published: true },
  { _type: "serviceArea", title: "Health Navigation", description: "Guiding clients through medical appointments, insurance applications, mental wellness support, and healthcare systems.", icon: "HeartPulse", order: 3, published: true },
  { _type: "serviceArea", title: "Legal Guidance", description: "Connecting clients with pro-bono legal aid, documentation support, and guidance through complex immigration processes.", icon: "Scale", order: 4, published: true },
  { _type: "serviceArea", title: "Employment Readiness", description: "Providing job placement assistance, resume workshops, interview coaching, and workplace communication practice.", icon: "Briefcase", order: 5, published: true },
  { _type: "serviceArea", title: "Education & Literacy", description: "Conducting English practice classes, adult digital literacy workshops, and youth after-school academic support.", icon: "GraduationCap", order: 6, published: true },
  { _type: "serviceArea", title: "Overseas Women Empowerment", description: "Partnering with grassroots organizations overseas to fund micro-grants, skill-building workshops, and women's leadership initiatives.", icon: "Globe2", order: 7, published: true },
];

// ─── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Starting Sanity seed...\n");

  // 6. Team Members
  console.log("\n👤 Creating team members...");
  for (const doc of teamMembers) {
    const result = await client.create(doc);
    console.log(`  ✅ Team member: ${result.name} (${result._id})`);
  }

  // 7. Founding Story (singleton)
  console.log("\n📖 Upserting founding story singleton...");
  const story = await client.createOrReplace(foundingStory);
  console.log(`  ✅ Founding story (${story._id})`);

  // 8. Service Areas
  console.log("\n🌐 Creating service areas...");
  for (const doc of serviceAreas) {
    const result = await client.create(doc);
    console.log(`  ✅ Service area: ${result.title} (${result._id})`);
  }

  console.log("\n🎉 Seed complete! All data has been pushed to Sanity.");
  console.log("   ➜ Open your Sanity Studio to review and publish the documents.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
