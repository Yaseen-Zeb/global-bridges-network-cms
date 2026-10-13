import { defineField, defineType } from "sanity";

/**
 * Contact & Site Settings — Singleton document (documentId: "contactInfo").
 *
 * Used by the website footer, the Contact and Donate page panels, the Donate
 * page Volunteer tab, the contact form's category dropdown, and the form
 * API routes (recipient emails).
 */
export default defineType({
  name: "contactInfo",
  title: "Contact & Site Settings",
  type: "document",
  icon: () => "📬",

  fields: [
    // ─── Public Contact Email (displayed on site) ───────────────────────
    defineField({
      name: "email",
      title: "Primary Email Address",
      description: "Displayed publicly in the footer and on the Contact and Donate pages.",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),

    // ─── Internal Recipient Emails (used by API routes) ──────────────────
    defineField({
      name: "contactRecipientEmail",
      title: "Contact Form — Recipient Email",
      type: "string",
      description:
        "All contact form submissions are forwarded to this address. Defaults to the primary email if left blank.",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "donateGoodsRecipientEmail",
      title: "Donate Goods Form — Recipient Email",
      type: "string",
      description:
        "All goods donation offers are forwarded to this address. Defaults to the primary email if left blank.",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "volunteerEmail",
      title: "Volunteer Inquiries Email",
      type: "string",
      description: "Shown on the Donate page → Volunteer tab.",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "donationFormUrl",
      title: "Donation Form URL (Zeffy)",
      type: "url",
      description:
        "Paste your Zeffy donation form URL here. This is embedded on the Donate page.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Optional. Include country code for international numbers.",
    }),
    defineField({
      name: "address",
      title: "Mailing / Office Address",
      type: "text",
      rows: 3,
      description: "One line per row, e.g. street on the first line, city on the second.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Twitter / X", value: "twitter" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "YouTube", value: "youtube" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "inquiryCategories",
      title: "Contact Form — Inquiry Categories",
      type: "array",
      description: "Options in the Inquiry Category dropdown on the Contact page. The first one is preselected.",
      of: [
        {
          type: "object",
          name: "inquiryCategory",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: "Short id included in the email, e.g. general, volunteer.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "email",
    },
    prepare({ title }) {
      return { title: "Contact & Site Settings", subtitle: title };
    },
  },
});
