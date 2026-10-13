import { defineArrayMember, defineField, defineType } from "sanity";
import { TITLE_HINT } from "./missionVision";

/**
 * Founders Journey — singleton (documentId: "foundersJourney").
 * The milestones in the green timeline section on the About page.
 * Only the milestones are managed here; the section heading lives in the website code.
 */
export default defineType({
  name: "foundersJourney",
  title: "Founders Journey",
  type: "document",
  icon: () => "🧭",
  fields: [
    defineField({
      name: "milestones",
      title: "Milestones",
      type: "array",
      description: "Shown top to bottom, alternating sides. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "milestone",
          fields: [
            defineField({ name: "eyebrow", title: "Overline", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "title", title: "Title", type: "text", rows: 2, description: TITLE_HINT, validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Text", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the photo for screen readers." })],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "eyebrow", subtitle: "title", media: "image" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Founders Journey" };
    },
  },
});
