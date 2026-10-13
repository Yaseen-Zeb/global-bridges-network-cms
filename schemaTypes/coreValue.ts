import { defineField, defineType } from "sanity";

/** Core Value — an item in the "Our Core Values" accordion on the About page. */
export default defineType({
  name: "coreValue",
  title: "Core Value",
  type: "document",
  icon: () => "💎",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first. The first value starts open.",
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
