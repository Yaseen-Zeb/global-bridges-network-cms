import { defineArrayMember, defineField, defineType, type FieldDefinition, type PreviewConfig } from "sanity";
import { InquiryCategoryInput } from "../components/InquiryCategoryInput";

/**
 * Website lists. Each list is ONE document (a fixed id pinned in the Studio menu)
 * holding its items in an array, so editors add, edit and drag-reorder items in one
 * place. Section headings are not here; they live in the website code.
 */

const altField = defineField({
  name: "alt",
  title: "Alt text",
  type: "string",
  description: "Describe the photo for screen readers.",
});

interface ListOptions {
  name: string;
  title: string;
  icon: string;
  description: string;
  item: {
    name: string;
    title: string;
    fields: FieldDefinition[];
    preview: PreviewConfig;
  };
}

function listDocument({ name, title, icon, description, item }: ListOptions) {
  return defineType({
    name,
    title,
    type: "document",
    icon: () => icon,
    fields: [
      defineField({
        name: "items",
        title: item.title,
        type: "array",
        description,
        of: [defineArrayMember({ type: "object", name: item.name, title: item.title.replace(/s$/, ""), fields: item.fields, preview: item.preview })],
      }),
    ],
    preview: { prepare: () => ({ title }) },
  });
}

export const servicesList = listDocument({
  name: "servicesList",
  title: "Services",
  icon: "🌐",
  description: "All services are listed on the Services page; the first four also show on the home page. Drag to reorder.",
  item: {
    name: "service",
    title: "Services",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required().max(300) }),
      defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, fields: [altField], validation: (Rule) => Rule.required() }),
      defineField({ name: "linkLabel", title: "Link Label", type: "string", description: 'Shown on the Services page, e.g. "Learn About Education".' }),
      defineField({ name: "linkHref", title: "Link URL", type: "string", description: 'A page path like "/contact" or a full https:// URL.' }),
      defineField({
        name: "inquiryCategory",
        title: "Contact Form Category",
        type: "string",
        description: "Preselected in the contact form when this link goes to the Contact page.",
        components: { input: InquiryCategoryInput },
        hidden: ({ parent }) => !/^\/contact\/?(#.*)?$/.test((parent as { linkHref?: string } | undefined)?.linkHref ?? ""),
      }),
    ],
    preview: { select: { title: "title", subtitle: "description", media: "image" } },
  },
});

export const whatWeDoList = listDocument({
  name: "whatWeDoList",
  title: "What We Do (About page)",
  icon: "🤝",
  description: "Cards in the About page grid. Drag to reorder.",
  item: {
    name: "whatWeDoCard",
    title: "Cards",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required().max(300) }),
      defineField({
        name: "cardSize",
        title: "Card Size",
        type: "string",
        options: {
          list: [
            { title: "Standard", value: "default" },
            { title: "Featured (blue, tall)", value: "featured" },
            { title: "Wide (two columns)", value: "wide" },
          ],
          layout: "radio",
        },
        initialValue: "default",
      }),
    ],
    preview: { select: { title: "title", subtitle: "description" } },
  },
});

export const leadershipList = listDocument({
  name: "leadershipList",
  title: "Founders & Leadership",
  icon: "👤",
  description: "People shown on the About page. Drag to reorder.",
  item: {
    name: "leader",
    title: "Team Members",
    fields: [
      defineField({ name: "name", title: "Full Name", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "title", title: "Role / Title", type: "string", description: 'E.g. "Co-Founder and CEO"', validation: (Rule) => Rule.required() }),
      defineField({
        name: "bio",
        title: "Bio",
        type: "array",
        description: "Each item is one paragraph.",
        of: [defineArrayMember({ type: "text", rows: 4 })],
        validation: (Rule) => Rule.required().min(1),
      }),
      defineField({ name: "photo", title: "Profile Photo", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    ],
    preview: { select: { title: "name", subtitle: "title", media: "photo" } },
  },
});

export const coreValuesList = listDocument({
  name: "coreValuesList",
  title: "Core Values",
  icon: "💎",
  description: "The About page accordion. The first value starts open. Drag to reorder.",
  item: {
    name: "coreValue",
    title: "Values",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    ],
    preview: { select: { title: "title", subtitle: "description" } },
  },
});

const FAQ_CATEGORIES: Record<string, string> = {
  general: "General",
  services: "Services",
  donations: "Financial Donations",
  "donate-goods": "Donate Goods",
  "get-involved": "Get Involved",
};

export const faqList = listDocument({
  name: "faqList",
  title: "FAQs",
  icon: "❓",
  description: "Questions on the FAQs page (grouped by category). Turn on “Show on Home Page” to include one in the home page FAQ. Drag to reorder.",
  item: {
    name: "faq",
    title: "Questions",
    fields: [
      defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (Rule) => Rule.required().min(10) }),
      defineField({
        name: "category",
        title: "Category",
        type: "string",
        options: { list: Object.entries(FAQ_CATEGORIES).map(([value, title]) => ({ title, value })), layout: "dropdown" },
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: "showOnHome", title: "Show on Home Page", type: "boolean", initialValue: false }),
    ],
    preview: {
      select: { title: "question", category: "category", showOnHome: "showOnHome" },
      prepare: ({ title, category, showOnHome }) => ({
        title: title as string,
        subtitle: `${FAQ_CATEGORIES[category as string] ?? category ?? ""}${showOnHome ? " · Home page" : ""}`,
      }),
    },
  },
});

export const goodsList = listDocument({
  name: "goodsList",
  title: "Goods We Accept / Decline",
  icon: "📦",
  description: "Cards on the Donate page. Accepted items also fill the goods form's category dropdown. Drag to reorder.",
  item: {
    name: "goodsItem",
    title: "Items",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required().max(250) }),
      defineField({
        name: "accepted",
        title: "Accepted?",
        type: "boolean",
        description: "On: green border and offered in the goods form. Off: red border, shown as not accepted.",
        initialValue: true,
      }),
    ],
    preview: {
      select: { title: "title", accepted: "accepted" },
      prepare: ({ title, accepted }) => ({ title: title as string, subtitle: accepted === false ? "⛔ Not accepted" : "✅ Accepted" }),
    },
  },
});

const POSITION_TYPES: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  volunteer: "Volunteer",
};

export const positionsList = listDocument({
  name: "positionsList",
  title: "Open Positions (Careers page)",
  icon: "💼",
  description:
    "Jobs on the Careers page. Shown jobs also fill the application form's role dropdown. With none shown, the page says there are no open positions. Drag to reorder.",
  item: {
    name: "position",
    title: "Positions",
    fields: [
      defineField({ name: "title", title: "Job Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({
        name: "type",
        title: "Type",
        type: "string",
        options: { list: Object.entries(POSITION_TYPES).map(([value, title]) => ({ title, value })), layout: "radio" },
        initialValue: "full-time",
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: "location", title: "Location", type: "string", description: 'E.g. "Ellicott City, MD", "Remote" or "Hybrid".' }),
      defineField({
        name: "summary",
        title: "Short Summary",
        type: "text",
        rows: 2,
        description: "One or two sentences shown on the job card.",
        validation: (Rule) => Rule.required().max(250),
      }),
      defineField({
        name: "description",
        title: "Full Description",
        type: "text",
        rows: 10,
        description: "Responsibilities, requirements, etc. Shown when a visitor opens the job. Leave a blank line between paragraphs.",
      }),
      defineField({
        name: "closingDate",
        title: "Closing Date",
        type: "date",
        description: "Optional. The job hides itself automatically after this date.",
      }),
      defineField({
        name: "active",
        title: "Show on Website",
        type: "boolean",
        description: "Turn off to hide this job without deleting it.",
        initialValue: true,
      }),
    ],
    preview: {
      select: { title: "title", type: "type", active: "active", closingDate: "closingDate" },
      prepare: ({ title, type, active, closingDate }) => ({
        title: title as string,
        subtitle: [active === false ? "⛔ Hidden" : "✅ Shown", POSITION_TYPES[type as string] ?? type, closingDate ? `closes ${closingDate}` : null]
          .filter(Boolean)
          .join(" · "),
      }),
    },
  },
});

/** Singleton ids, in Studio menu order. */
export const LIST_DOCUMENTS = [
  { id: "services", type: "servicesList", title: "Services", icon: "🌐" },
  { id: "whatWeDo", type: "whatWeDoList", title: "What We Do (About page)", icon: "🤝" },
  { id: "leadership", type: "leadershipList", title: "Founders & Leadership", icon: "👤" },
  { id: "coreValues", type: "coreValuesList", title: "Core Values", icon: "💎" },
  { id: "faqs", type: "faqList", title: "FAQs", icon: "❓" },
  { id: "goods", type: "goodsList", title: "Goods We Accept / Decline", icon: "📦" },
  { id: "positions", type: "positionsList", title: "Open Positions (Careers page)", icon: "💼" },
] as const;
