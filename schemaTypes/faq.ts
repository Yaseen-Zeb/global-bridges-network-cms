import { defineField, defineType } from "sanity";

/**
 * FAQ Schema
 * Mirrors: frontend/src/data/faqs.ts → FAQItem interface
 *
 * Fields:
 *  category  – Maps to the FAQ page tab / section
 *  question  – The question text
 *  answer    – The answer text (plain text, no rich text needed here)
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
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first within their category.",
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
