import { defineField, defineType } from "sanity";

/**
 * Founding Story Schema — Singleton document
 * Used for the "Our Founding Story" section on the About page.
 * documentId: "foundingStory"
 */
export default defineType({
  name: "foundingStory",
  title: "Founding Story",
  type: "document",
  icon: () => "📖",
  fields: [
    defineField({
      name: "paragraphs",
      title: "Story Paragraphs",
      type: "array",
      description: "Each item is one paragraph of the founding story text.",
      of: [{ type: "text" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Founding Story" };
    },
  },
});
