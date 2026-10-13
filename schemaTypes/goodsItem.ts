import { defineField, defineType } from "sanity";

/**
 * Goods Item — the "What We Can Accept & What We Cannot Accept" cards on the
 * Donate page. Accepted items also fill the goods form's Item Category dropdown.
 */
export default defineType({
  name: "goodsItem",
  title: "Goods Item",
  type: "document",
  icon: () => "📦",
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
      validation: (Rule) => Rule.required().max(250),
    }),
    defineField({
      name: "accepted",
      title: "Accepted?",
      type: "boolean",
      description:
        "On: shown with a green border and offered in the goods form. Off: shown with a red border as not accepted.",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first (accepted items are always listed before not-accepted ones).",
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: "title", accepted: "accepted" },
    prepare({ title, accepted }) {
      return { title, subtitle: accepted ? "✅ Accepted" : "⛔ Not accepted" };
    },
  },
  orderings: [
    {
      title: "Accepted first, then Display Order",
      name: "acceptedOrder",
      by: [
        { field: "accepted", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
