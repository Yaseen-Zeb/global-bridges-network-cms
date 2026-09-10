import { defineField, defineType } from "sanity";

/**
 * Testimonial Schema
 * Mirrors: frontend/src/data/testimonials.ts → Testimonial interface
 *
 * Fields:
 *  quote         – The testimonial text
 *  authorName    – Display name (anonymised as appropriate)
 *  authorRole    – Role / relationship to the org
 *  category      – Filters testimonials by programme area
 *  date          – Human-readable period string (e.g. "Spring 2025")
 *  image         – Optional author photo (Sanity image asset)
 *  published     – Toggle to show/hide from the website
 */
export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: () => "💬",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(20).max(600),
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      description: "Use anonymised/role-based names to protect participant privacy.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author Role / Programme",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Resettlement", value: "resettlement" },
          { title: "Women's Empowerment", value: "women-empowerment" },
          { title: "Volunteers", value: "volunteers" },
          { title: "Partners", value: "partners" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date / Period",
      type: "string",
      description: 'Human-readable period, e.g. "Spring 2025" or "Winter 2024".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Author Photo",
      type: "image",
      description: "Optional. Use an anonymised or representative photo.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "Only published testimonials appear on the website.",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "authorName",
      subtitle: "category",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Date (newest first)",
      name: "dateDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
