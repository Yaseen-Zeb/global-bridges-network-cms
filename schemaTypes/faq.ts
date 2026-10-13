import { defineField, defineType } from "sanity";

/**
 * FAQ — shown on the FAQs page (grouped by category) and, when "Show on Home
 * Page" is on, in the home page FAQ section.
 */
export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: () => "❓",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Services", value: "services" },
          { title: "Financial Donations", value: "donations" },
          { title: "Donate Goods", value: "donate-goods" },
          { title: "Get Involved", value: "get-involved" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "showOnHome",
      title: "Show on Home Page",
      type: "boolean",
      description: "Include this question in the home page FAQ section.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first (within their category, and on the home page).",
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "category",
    },
    prepare({ title, subtitle }) {
      const categoryMap: Record<string, string> = {
        general: "General",
        services: "Services",
        donations: "Financial Donations",
        "donate-goods": "Donate Goods",
        "get-involved": "Get Involved",
      };
      return {
        title,
        subtitle: categoryMap[subtitle] ?? subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Category then Order",
      name: "categoryOrder",
      by: [
        { field: "category", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
