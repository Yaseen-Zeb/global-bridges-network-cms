import { defineField, defineType } from "sanity";

/** What We Do — a card in the "Support That Creates Opportunity" grid on the About page. */
export default defineType({
  name: "whatWeDo",
  title: "What We Do",
  type: "document",
  icon: () => "🤝",
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
      validation: (Rule) => Rule.required().max(300),
    }),
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
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 99,
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
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
