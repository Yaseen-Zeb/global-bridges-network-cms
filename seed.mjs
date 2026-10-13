/**
 * Sanity seed script for the redesigned website.
 *
 * Run from the backend folder:   node --env-file=.env seed.mjs
 * Run only some steps:            node --env-file=.env seed.mjs missionVision team
 * Requires SANITY_API_TOKEN (Editor role) in .env.
 *
 * Idempotent: documents use fixed ids and are replaced on every run, so it is safe
 * to run again. Images are uploaded from ../frontend/public (Sanity de-duplicates
 * identical files).
 *
 * It never touches: the contact/goods form recipient emails, the Zeffy donation
 * link. It replaces the placeholder team
 * members, the old service list (moved to "What We Do") and the founding story.
 */

import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { basename, resolve } from "node:path";

const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN } = process.env;
if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_TOKEN) {
  console.error("Missing SANITY_PROJECT_ID / SANITY_DATASET / SANITY_API_TOKEN. Run: node --env-file=.env seed.mjs");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const PUBLIC = resolve(import.meta.dirname, "../frontend/public");
const imageCache = new Map();

/** Upload a file from frontend/public and return an image field value (optional focal point 0–1). */
async function image(publicPath, alt, focus) {
  if (!imageCache.has(publicPath)) {
    const asset = await client.assets.upload("image", createReadStream(resolve(PUBLIC, publicPath.replace(/^\//, ""))), {
      filename: basename(publicPath),
    });
    imageCache.set(publicPath, asset._id);
  }
  return {
    _type: "image",
    asset: { _type: "reference", _ref: imageCache.get(publicPath) },
    ...(alt ? { alt } : {}),
    ...(focus ? { hotspot: { _type: "sanity.imageHotspot", x: focus[0], y: focus[1], width: 1, height: 1 } } : {}),
  };
}

const key = (prefix, i) => `${prefix}${i}`;

// ─── Contact & Site Settings ──────────────────────────────────────────────────

async function seedSiteSettings() {
  await client
    .patch("contactInfo")
    .set({
      email: "hello@globalbridgesnetwork.org",
      phone: "877-829-5500",
      address: "10201 Kings Arm Tavern Ct\nEllicott City, MD 21042",
      volunteerEmail: "volunteer@globalbridgesnetwork.org",
      inquiryCategories: [
        { label: "General Inquiry", value: "general" },
        { label: "Request for Help", value: "request-help" },
        { label: "Services Inquiry", value: "services" },
        { label: "Donate Goods", value: "donate-goods" },
        { label: "Volunteer", value: "volunteer" },
        { label: "Partnership", value: "partnership" },
      ].map((c, i) => ({ _key: key("cat", i), _type: "inquiryCategory", ...c })),
    })
    // Removed from the schema; the social links held localhost test URLs.
    .unset(["officeHours", "mapEmbedUrl", "socialLinks"])
    .commit();
  console.log("✅ Contact & Site Settings");
}

// ─── FAQs shown on the home page ──────────────────────────────────────────────

const HOME_FAQS = [
  {
    category: "services",
    question: "How can I request support?",
    answer:
      "You can explore our available services and support options, then contact us to discuss your needs and find the right assistance.",
  },
  {
    category: "general",
    question: "What type of support does Global Bridges Network provide?",
    answer:
      "We connect individuals and families with education and skills opportunities, community support, and essential goods and resources that help them build stable, independent lives.",
  },
  {
    category: "get-involved",
    question: "How can I become a volunteer?",
    answer:
      "Visit our Donate page and open the Volunteer tab to learn about current volunteer opportunities and share how you would like to help. Our team will follow up with next steps.",
  },
  {
    category: "donate-goods",
    question: "What goods can I donate?",
    answer:
      "We accept essential household items, clothing, hygiene supplies, and school materials in good or new condition. Visit our Donate page to see what we accept and submit an offer.",
  },
  {
    category: "donations",
    question: "How can I make a monetary donation?",
    answer: "You can give securely online through our Donate page, with one-time and monthly giving options available.",
  },
];

async function seedFaqs() {
  for (const [i, faq] of HOME_FAQS.entries()) {
    await client.createOrReplace({ _id: `faq-home-${i + 1}`, _type: "faq", ...faq, showOnHome: true, order: i + 1 });
  }
  console.log(`✅ ${HOME_FAQS.length} home page FAQs`);
}

// ─── Leadership ───────────────────────────────────────────────────────────────

const TEAM = [
  {
    slug: "hameed-girowal",
    name: "Hameed Girowal",
    title: "Co-Founder and CEO",
    photo: "/images/about/team-hameed-girowal.jpg",
    bio: [
      "Hameed Girowal is an accomplished executive leader with more than 20 years of experience in nonprofit management, refugee resettlement, humanitarian assistance, and community development. Throughout his career, he has led complex programs and diverse teams dedicated to serving refugees, immigrants, and other vulnerable populations.",
      "Hameed holds a Bachelor of Business Administration. A former refugee himself, Hameed brings both personal understanding and professional expertise to his work. Prior to coming to the United States, he spent nearly a decade supporting the U.S. mission in Afghanistan, working alongside U.S. government and military partners in administrative, operational, and cross-cultural roles.",
      "As a nonprofit executive, he has successfully developed and expanded programs in refugee resettlement, employment, education, workforce development, legal services, and women’s empowerment, while strengthening partnerships with government agencies, community organizations, employers, and other stakeholders.",
    ],
  },
  {
    slug: "mamadou-sy",
    name: "Dr. Mamadou Sy",
    title: "Co-Founder and President",
    photo: "/images/about/team-mamadou-sy.jpg",
    bio: [
      "Dr. Mamadou Sy is an accomplished executive leader with more than 20 years of experience in human services, nonprofit management, and the U.S. Refugee Admissions Program. Throughout his career, he has led complex, mission-driven organizations dedicated to serving refugees, immigrants, and other vulnerable populations.",
      "A former refugee himself, Dr. Sy has helped advance services that supported the successful resettlement and integration of more than 15,000 refugees in Virginia, Maryland, and Washington D.C.",
      "Dr. Sy holds a Ph.D. in Egyptology from Cheikh Anta Diop University in Dakar, Senegal. His dedication to public service is reflected in a range of civic leadership roles, including serving as a Commissioner on the Maryland Governor’s Commission on African Affairs, Chair of the Workforce Development Subcommittee for the Baltimore Mayor’s New Americans Task Force, a member of the Virginia Department of Behavioral Health and Developmental Services’ Cultural and Linguistic Competency Advisory Committee, and a member of the Maryland Governor’s Immigrant Rights Task Force-Crime Victims Subcommittee.",
    ],
  },
  {
    slug: "raymond-rawlins",
    name: "Raymond R. Rawlins",
    title: "Chief Financial Officer",
    photo: "/images/about/team-raymond-rawlins.jpg",
    bio: [
      "Raymond Rawlins is an accomplished Chief Financial Officer and Board Treasurer with more than two decades of experience strengthening the financial health, governance, and long-term sustainability of nonprofit, government, and private sector organizations. Known for delivering 23 consecutive clean audits and guiding multiple institutions from deficit to surplus, he brings a proven record of strategic financial leadership, operational transformation, and disciplined stewardship of public and philanthropic resources. His career reflects a deep commitment to transparency, accountability, and the responsible management of charitable and stewarded assets. He has solid experience in accounting and finance and guided organizations through fiscal recovery, restructuring, and growth to ensure financial sustainability. He has provided Federal regulations compliance training to all staff and board of directors, managed budgets from $7 million to $450 million and completed year-end audits with no findings in the last four years.",
    ],
  },
];

async function seedTeam() {
  // Remove the placeholder members created by the original seed.
  const placeholders = await client.fetch(`*[_type == "teamMember" && !(_id in $keep)]._id`, {
    keep: TEAM.map((m) => `team-${m.slug}`),
  });
  for (const id of placeholders) await client.delete(id);
  if (placeholders.length) console.log(`🗑  Removed ${placeholders.length} placeholder team member(s)`);

  for (const [i, m] of TEAM.entries()) {
    await client.createOrReplace({
      _id: `team-${m.slug}`,
      _type: "teamMember",
      name: m.name,
      title: m.title,
      bio: m.bio,
      photo: await image(m.photo, `Portrait of ${m.name}`),
      order: i + 1,
      published: true,
    });
  }
  console.log(`✅ ${TEAM.length} team members`);
}

// ─── Services & What We Do ────────────────────────────────────────────────────

const WHAT_WE_DO = [
  {
    title: "Refugee & Immigrant Support",
    cardSize: "featured",
    description:
      "Supporting refugees and immigrants with resettlement assistance, community orientation, and the resources they need to begin again.",
  },
  {
    title: "Overseas Women Empowerment",
    cardSize: "wide",
    description:
      "Empowering women through skills, resources, opportunities, and community partnerships that support greater independence.",
  },
  {
    title: "Legal Guidance",
    description:
      "Connecting individuals and families with legal support and guidance to help them navigate important processes and challenges.",
  },
  { title: "Health Navigation", description: "Helping individuals and families access healthcare resources and navigate the services they need." },
  {
    title: "Employment Readiness",
    description:
      "Connecting people with employment and vocational opportunities that support greater independence and self sufficiency.",
  },
  {
    title: "Resettlement Services",
    description:
      "Helping newly arrived individuals and families navigate resettlement and access the resources they need to establish their lives.",
  },
  {
    title: "Education & Literacy",
    description:
      "Connecting people with education, skills, and opportunities that support personal growth and long term independence.",
  },
];

const SERVICES = [
  {
    slug: "education",
    title: "Education & Literacy",
    description:
      "We offer practical support, resources, and opportunities that help individuals and families build safe, healthy, and independent lives.",
    linkLabel: "Learn About Education",
    image: ["/images/services/area-education.jpg", "A young girl in a polka-dot hijab writing at a school desk", [0.5, 0.35]],
  },
  {
    slug: "resettlement",
    title: "Resettlement Support",
    description:
      "Practical help for newly arrived refugees and immigrants as they adjust to their new communities and begin rebuilding their lives.",
    linkLabel: "Explore Resettlement Support",
    image: ["/images/services/area-resettlement.jpg", "A father holding his young child at the entrance of a tent", [0.46, 0.5]],
  },
  {
    slug: "women",
    title: "Women Empowerment",
    description: "Resources and opportunities that help women build confidence, develop skills, and become more independent.",
    linkLabel: "Explore Women’s Empowerment",
    image: ["/images/services/area-women.jpg", "A group of smiling women standing together in a workshop"],
  },
  {
    slug: "legal",
    title: "Legal Guidance",
    description: "Legal support that helps individuals and families understand their options and get through important processes.",
    linkLabel: "Explore Legal Support",
    image: ["/images/services/area-legal.jpg", "A law book with scales of justice resting under open documents", [0.5, 0.6]],
  },
];


async function seedServices() {
  const keep = SERVICES.map((svc) => `service-${svc.slug}`);
  for (const [i, svc] of SERVICES.entries()) {
    await client.createOrReplace({
      _id: keep[i],
      _type: "serviceArea",
      title: svc.title,
      description: svc.description,
      linkLabel: svc.linkLabel,
      linkHref: "/contact",
      image: await image(...svc.image),
      order: i + 1,
      published: true,
    });
  }

  // Older service documents (the pre-redesign list) now live under "What We Do".
  const stale = await client.fetch(`*[_type == "serviceArea" && !(_id in $keep)]._id`, { keep });
  for (const id of stale) await client.delete(id);
  console.log(`✅ ${SERVICES.length} services${stale.length ? ` (removed ${stale.length} old)` : ""}`);
}

async function seedWhatWeDo() {
  for (const [i, item] of WHAT_WE_DO.entries()) {
    await client.createOrReplace({
      _id: `what-we-do-${i + 1}`,
      _type: "whatWeDo",
      title: item.title,
      description: item.description,
      cardSize: item.cardSize ?? "default",
      order: i + 1,
      published: true,
    });
  }
  console.log(`✅ ${WHAT_WE_DO.length} What We Do cards`);
}

// ─── Core values ──────────────────────────────────────────────────────────────

const CORE_VALUES = [
  {
    title: "Compassion",
    description:
      "People come first, always. We meet everyone with kindness, empathy, and respect, because every journey looks different, and every story deserves to be heard.",
  },
  // The design only shows Compassion's text; the rest are drafts for the client to confirm.
  {
    title: "Hope",
    description:
      "We believe every new beginning holds possibility. We help people see a way forward and walk alongside them as they build it.",
  },
  {
    title: "Empowerment",
    description:
      "We focus on lasting independence, giving people the skills, resources, and confidence to shape their own futures.",
  },
  {
    title: "Community",
    description:
      "No one should face a new start alone. We build connections between neighbours, partners, and cultures so everyone can belong and contribute.",
  },
  {
    title: "Our Promise",
    description:
      "We show up with consistency and care, honouring the trust people place in us and following through on every commitment we make.",
  },
  {
    title: "Integrity",
    description:
      "We act with honesty, transparency, and accountability in everything we do, and we steward every resource responsibly.",
  },
];

async function seedCoreValues() {
  for (const [i, v] of CORE_VALUES.entries()) {
    await client.createOrReplace({ _id: `core-value-${i + 1}`, _type: "coreValue", ...v, order: i + 1 });
  }
  console.log(`✅ ${CORE_VALUES.length} core values`);
}

// ─── Goods accepted / declined ────────────────────────────────────────────────

const GOODS = [
  ["Household & Cookware Starter Kits", "Pots, pans, stainless steel cookware, dishware, eating utensils, and basic kitchen tools in clean condition.", true],
  ["Winter Outerwear & Warm Blankets", "Clean coats, jackets, gloves, scarves, and thermal blankets for adults and children arriving in winter months.", true],
  ["School Backpacks & Academic Supplies", "New or like-new backpacks, notebooks, pens, pencils, markers, and calculators for students.", true],
  ["Hygiene & Personal Care Packages", "Unopened soap, shampoo, toothpaste, toothbrushes, feminine hygiene products, and grooming supplies.", true],
  ["Baby & Children Supplies", "Unopened diapers, baby wipes, strollers, clean children’s clothing, and safe educational toys.", true],
  ["Large Bulky Electrical Appliances", "Large refrigerators, stoves, or unverified heavy appliances due to storage limitations.", false],
  ["Damaged or Heavily Stained Items", "Torn clothing, broken furniture, or items requiring major repair or deep cleaning.", false],
  ["Used Mattresses & Open Bedding", "Used mattresses, used bed pillows, or unwashed bed linens due to health and safety regulations.", false],
  ["Opened Hygiene Products", "Opened, partially used, or unsealed personal care products and cosmetics.", false],
];

async function seedGoods() {
  for (const [i, [title, description, accepted]] of GOODS.entries()) {
    await client.createOrReplace({ _id: `goods-item-${i + 1}`, _type: "goodsItem", title, description, accepted, order: i + 1 });
  }
  console.log(`✅ ${GOODS.length} goods items`);
}

// ─── Legal pages ──────────────────────────────────────────────────────────────

const withKeys = (sections) =>
  sections.map((s, i) => ({ _key: key("section", i), _type: "legalSection", ...s }));

const LEGAL_PAGES = [
  {
    _id: "privacyPolicy",
    eyebrow: "Privacy Policy",
    titleLines: ["Your Privacy", "Matters"],
    description: "We respect your privacy and are committed to protecting the information you share with Global Bridges Network.",
    lastUpdated: "2026-09-16",
    sections: [
      {
        title: "Introduction",
        paragraphs: [
          "Global Bridges Network (“we,” “our,” or “us”) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website, contact us, volunteer, donate, or engage with our programs and services.",
        ],
      },
      {
        title: "Information We Collect",
        intro: "We may collect personal information that you provide directly to us, including:",
        bullets: [
          "Contact Information: Name, email address, phone number, and mailing address.",
          "Donation Information: Details related to financial or in-kind donations.",
          "Volunteer Information: Details submitted through volunteer forms.",
          "Inquiry Information: Messages or requests submitted through our contact forms.",
        ],
      },
      {
        title: "How We Use Your Information",
        intro: "We use the information we collect to:",
        bullets: [
          "Respond to your inquiries and provide requested services.",
          "Process donations and send appropriate acknowledgements.",
          "Communicate about our programs, events, and opportunities.",
          "Improve our website, services, and user experience.",
          "Comply with applicable legal and regulatory requirements.",
        ],
      },
      {
        title: "Sharing Your Information",
        paragraphs: ["We do not sell, rent, or trade your personal information."],
        intro: "We may share information only when necessary:",
        bullets: [
          "With trusted service providers who help us operate our website and programs.",
          "When required by law or to comply with legal obligations.",
          "To protect the safety, rights, or property of Global Bridges Network, our community, or others.",
        ],
      },
      {
        title: "Cookies & Tracking Technologies",
        paragraphs: [
          "Our website may use cookies and similar technologies to improve your browsing experience and understand how our website is used.",
          "You can adjust your browser settings to disable cookies if you prefer.",
        ],
      },
    ],
  },
  {
    _id: "termsAndConditions",
    eyebrow: "Terms & Conditions",
    titleLines: ["Terms for Using Our", "Website and Services"],
    description:
      "These Terms & Conditions explain the rules for using the Global Bridges Network website and engaging with our online services, donation options, and other resources.",
    lastUpdated: "2026-09-16",
    sections: [
      {
        title: "Acceptance of Terms",
        paragraphs: [
          "By accessing or using the Global Bridges Network website, you agree to comply with these Terms & Conditions and all applicable laws and regulations.",
          "If you do not agree with these terms, please do not use our website or services.",
        ],
      },
      {
        title: "About Global Bridges Network",
        paragraphs: [
          // As designed — this repeats section 01's first sentence; confirm the intended copy with the client.
          "By accessing or using the Global Bridges Network website, you agree to comply with these Terms & Conditions and all applicable laws and regulations.",
          "Our website provides information about our programs, services, initiatives, donation opportunities, volunteer activities, and ways to get involved.",
        ],
      },
      {
        title: "Use of Our Website",
        paragraphs: ["You agree to use this website responsibly and only for lawful purposes."],
        intro: "You must not:",
        bullets: [
          "Use the website for fraudulent or unlawful activities.",
          "Submit false, misleading, or inaccurate information.",
          "Attempt to gain unauthorized access to our systems.",
          "Interfere with the security or operation of the website.",
          "Copy, reproduce, or misuse website content without permission.",
        ],
      },
      {
        title: "Donations",
        paragraphs: ["We appreciate every contribution made to support our work."],
        intro: "By making a monetary donation through our website, you confirm that:",
        bullets: [
          "The information you provide is accurate and authorized.",
          "You are authorized to use the selected payment method.",
          "Donations are made voluntarily.",
          "Donation transactions may be processed through third-party payment providers.",
        ],
        outro:
          "Where applicable, donation receipts or acknowledgements may be provided using the contact information submitted with your donation.",
      },
      {
        title: "Goods Donations",
        paragraphs: [
          "If you offer goods or physical items to Global Bridges Network, you agree that the information provided about the items is accurate.",
          "All goods donations may be reviewed before acceptance. We reserve the right to decline items that are unsuitable, unsafe, damaged, prohibited, or not aligned with current community needs.",
          "Submitting a goods donation offer does not guarantee that the items will be accepted.",
        ],
      },
    ],
  },
];

async function seedLegalPages() {
  for (const page of LEGAL_PAGES) {
    await client.createOrReplace({ ...page, _type: "legalPage", sections: withKeys(page.sections) });
  }
  console.log(`✅ ${LEGAL_PAGES.length} legal pages`);
}

// ─── Mission & Vision, Founders Journey (About page) ───────────────────────────

const JOURNEY = [
  {
    eyebrow: "Where It Started",
    title: "A Mission Rooted\nin Experience",
    description:
      "Our founders are former refugees who understand the challenges of starting over. Their personal experiences shaped a commitment to help others find safety, opportunity, and a sense of belonging.",
    image: ["/images/about/journey-start.jpg", "A hand pinning notes to a planning board"],
  },
  {
    eyebrow: "Years of Service",
    title: "Experience That\nCreated Impact",
    description:
      "Before Global Bridges Network, our founders spent decades serving refugees, immigrants, and vulnerable communities through resettlement, employment, education, humanitarian assistance, and community development.",
    image: ["/images/about/journey-impact.jpg", "A team reviewing notes together around an office desk"],
  },
  {
    eyebrow: "Global Bridges Network",
    title: "A Broader\nCommitment",
    description:
      "Today, Global Bridges Network brings this experience together to connect refugees, immigrants, asylees, and vulnerable families with the resources and opportunities they need to thrive and contribute to their communities.",
    image: ["/images/about/journey-commitment.jpg", "Staff working in the Global Bridges Network office"],
  },
  {
    eyebrow: "Looking Ahead",
    title: "Creating Communities\nWhere Everyone Belongs",
    description:
      "The journey continues with a vision of stronger communities where people can live with dignity, pursue their dreams, and feel that they truly belong.",
    image: ["/images/about/journey-ahead.jpg", "Hands stacked together in unity"],
  },
];

async function seedMissionVision() {
  await client.createOrReplace({
    _id: "missionVision",
    _type: "missionVision",
    mission: {
      eyebrow: "Our Mission",
      title: "Helping People\nBuild Better Futures",
      description:
        "Global Bridges Network empowers refugees, immigrants, asylees, and vulnerable individuals and families through resettlement assistance, employment, education, legal support, healthcare access, women’s empowerment, and community partnerships.",
    },
    vision: {
      eyebrow: "Our Vision",
      title: "A Future Where\nEveryone Can Thrive",
      description:
        "We envision a world where every person can live with dignity, pursue their dreams, and feel that they truly belong. Stronger communities grow when people from different cultures, backgrounds, and generations have the opportunity to understand, contribute, and flourish together.",
    },
  });
  console.log("✅ Mission & Vision");
}

async function seedFoundersJourney() {
  const milestones = [];
  for (const [i, m] of JOURNEY.entries()) {
    milestones.push({
      _key: key("milestone", i),
      _type: "milestone",
      eyebrow: m.eyebrow,
      title: m.title,
      description: m.description,
      image: await image(...m.image),
    });
  }

  await client.createOrReplace({
    _id: "foundersJourney",
    _type: "foundersJourney",
    eyebrow: "Founders Journey",
    title: "From Experience\nto Empowerment",
    description:
      "Global Bridges Network grew from lived experience and decades of service into an organization focused on helping people build safe, healthy, and self sufficient lives.",
    milestones,
  });
  console.log(`✅ Founders Journey (${milestones.length} milestones)`);
}

// ─── Four Ways (Donate page) ──────────────────────────────────────────────────

const IMPACT_CARDS = [
  {
    icon: "volunteer",
    title: "Volunteer\nYour Time",
    description:
      "Share your skills and time as a community mentor, assist with English language practice, or help organize local welcome events.",
    image: ["/images/donate/way-volunteer.jpg", "A volunteer standing with arms crossed during a forest clean-up"],
    buttonLabel: "Inquire About Volunteering",
    buttonAction: "tab",
    buttonTab: "volunteer",
  },
  {
    icon: "goods",
    title: "Donate\nEssential Goods",
    description:
      "Provide physical necessities such as winter coats, cookware sets, hygiene packages, and school supplies for arriving families.",
    image: ["/images/donate/way-goods.jpg", "Smiling volunteers handing out water beside aid boxes"],
    buttonLabel: "View Goods Needed",
    buttonAction: "link",
    buttonHref: "#accepted-goods",
  },
  {
    icon: "partner",
    title: "Partner\nWith Us",
    description:
      "Collaborate as a local business, community organization, school, or faith group to host drives or support integration efforts.",
    image: ["/images/donate/way-partner.jpg", "Two older adults talking warmly over coffee"],
    buttonLabel: "Explore Partnerships",
    buttonAction: "link",
    buttonHref: "/contact",
  },
  {
    icon: "share",
    title: "Share\nOur Mission",
    description:
      "Help raise awareness by sharing our stories, advocating for refugee dignity, and amplifying community voices within your networks.",
    image: ["/images/donate/way-share.jpg", "Colleagues meeting around a conference table"],
    buttonLabel: "Spread the Word",
    buttonAction: "share",
  },
];

async function seedImpactWays() {
  const cards = [];
  for (const [i, { image: img, ...card }] of IMPACT_CARDS.entries()) {
    cards.push({ _key: key("card", i), _type: "impactCard", ...card, image: await image(...img) });
  }
  await client.createOrReplace({
    _id: "impactWays",
    _type: "impactWays",
    eyebrow: "Practical Support",
    title: "Four Ways You Can\nMake an Impact",
    description: "Choose a pathway that aligns with your capacity, skills, and community goals.",
    cards,
  });
  console.log(`✅ Four Ways (${cards.length} cards)`);
}

// ─── Retired content ──────────────────────────────────────────────────────────

async function removeRetired() {
  // The founding story was replaced by the Founders Journey on the About page.
  const ids = await client.fetch(`*[_type == "foundingStory"]._id`);
  for (const id of ids) await client.delete(id);
  if (ids.length) console.log(`🗑  Removed retired founding story`);
}

const STEPS = {
  siteSettings: seedSiteSettings,
  faqs: seedFaqs,
  team: seedTeam,
  services: seedServices,
  whatWeDo: seedWhatWeDo,
  coreValues: seedCoreValues,
  goods: seedGoods,
  legalPages: seedLegalPages,
  missionVision: seedMissionVision,
  foundersJourney: seedFoundersJourney,
  impactWays: seedImpactWays,
  removeRetired,
};

// No arguments: run everything. Otherwise only the named steps, e.g. `node --env-file=.env seed.mjs missionVision`.
const requested = process.argv.slice(2);
const unknown = requested.filter((name) => !(name in STEPS));
if (unknown.length) {
  console.error(`Unknown step(s): ${unknown.join(", ")}. Available: ${Object.keys(STEPS).join(", ")}`);
  process.exit(1);
}
for (const [name, step] of Object.entries(STEPS)) {
  if (requested.length === 0 || requested.includes(name)) await step();
}
console.log("🎉 Done");
