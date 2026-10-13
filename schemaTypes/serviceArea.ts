import { defineField, defineType } from "sanity";

/**
 * Service — listed in full on the Services page; the first four (by Display
 * Order) also appear on the home page with a "See more" link to the Services page.
 */
export default defineType({
  name: "serviceArea",
  title: "Service",
  type: "document",
  icon: () => "🌐",
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
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the photo for screen readers.",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkLabel",
      title: "Link Label",
      type: "string",
      description: 'Shown on the Services page, e.g. "Learn About Education".',
    }),
    defineField({
      name: "linkHref",
      title: "Link URL",
      type: "string",
      description: 'A page path like "/contact" or a full https:// URL.',
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first. The first four also show on the home page.",
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
    select: { title: "title", subtitle: "description", media: "image" },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
