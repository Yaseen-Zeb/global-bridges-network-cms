import { defineArrayMember, defineField, defineType } from "sanity";
import { TITLE_HINT } from "./missionVision";

/**
 * Supporting Our Work — singleton (documentId: "supportWays").
 * The cards in the black "Interested in Supporting Our Work?" section on the Donate page.
 * Only the cards are managed here; the section heading lives in the website code.
 */
export default defineType({
  name: "supportWays",
  title: "Supporting Our Work (Donate page)",
  type: "document",
  icon: () => "🤲",
  fields: [
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      description: "Shown three per row on desktop. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "supportCard",
          fields: [
            defineField({ name: "title", title: "Title", type: "text", rows: 2, description: TITLE_HINT, validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Text", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Supporting Our Work (Donate page)" };
    },
  },
});
