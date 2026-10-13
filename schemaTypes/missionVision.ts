import { defineField, defineType } from "sanity";

export const TITLE_HINT = "Press Enter to start a new line; line breaks are kept on the website.";

/** A titled text block (Our Mission / Our Vision). */
const statement = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({ name: "eyebrow", title: "Overline", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "title", title: "Title", type: "text", rows: 2, description: TITLE_HINT, validation: (Rule) => Rule.required() }),
      defineField({ name: "description", title: "Text", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    ],
    validation: (Rule) => Rule.required(),
  });

/**
 * Mission & Vision — singleton (documentId: "missionVision").
 * The two white cards near the top of the About page.
 */
export default defineType({
  name: "missionVision",
  title: "Mission & Vision",
  type: "document",
  icon: () => "🎯",
  fields: [statement("mission", "Our Mission"), statement("vision", "Our Vision")],
  preview: {
    prepare() {
      return { title: "Mission & Vision" };
    },
  },
});
