import { defineField, defineType } from "sanity";

/**
 * Team Member Schema
 * Used for the "Our Founders & Leadership Team" section on the About page.
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
      description: 'E.g. "Co-Founder & Executive Director"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(20).max(600),
    }),
    defineField({
      name: "photo",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn Profile URL",
      type: "url",
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
