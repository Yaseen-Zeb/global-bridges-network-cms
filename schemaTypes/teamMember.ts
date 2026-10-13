import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Team Member — "Our Founders & Leadership Team" on the About page.
 */
export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: () => "👤",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Role / Title",
      type: "string",
      description: 'E.g. "Co-Founder and CEO"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      description: "Each item is one paragraph.",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "photo",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
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
      description: "Only published members appear on the website.",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "title",
      media: "photo",
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
