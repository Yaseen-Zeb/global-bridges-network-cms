import { defineField, defineType } from "sanity";

/**
 * Contact Info Schema — Singleton document
 * Mirrors: frontend/src/data/contact-info.ts
 *
 * There is only ONE document of this type (documentId: "contactInfo").
 * Founders update org contact details here; the studio structure
 * pins it as a singleton so it cannot be duplicated.
 *
 * Fields:
 *  email           – Primary contact email address
 *  phone           – Optional phone number
 *  address         – Optional physical / mailing address
 *  mapEmbedUrl     – Optional Google Maps embed URL
 *  socialLinks     – Array of { platform, url } objects
 *  officeHours     – Human-readable hours string
 */
export default defineType({
  name: "contactInfo",
  title: "Contact Information",
  type: "document",
  icon: () => "📬",
  __experimental_actions: ["update", "publish"],  // prevent create/delete in UI
  fields: [
    defineField({
      name: "email",
      title: "Primary Email Address",
      type: "string",
      validation: (Rule) =>
        Rule.required().email(),
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
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps Embed URL",
      type: "url",
      description: "Paste the iframe src URL from Google Maps → Share → Embed a map.",
    }),
    defineField({
      name: "officeHours",
      title: "Office Hours",
      type: "string",
      description: 'E.g. "Monday – Friday, 9:00 AM – 5:00 PM EST".',
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
  ],
  preview: {
    select: {
      title: "email",
    },
    prepare({ title }) {
      return { title: "Contact Information", subtitle: title };
    },
  },
});
