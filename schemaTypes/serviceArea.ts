import { defineField, defineType } from "sanity";

/**
 * Service Area Schema
 * Used for the "What We Do" section on the About page.
 *
 * The icon field stores a string key that maps to a Lucide icon on the frontend.
 */
export default defineType({
  name: "serviceArea",
  title: "Service Area",
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
      name: "icon",
      title: "Icon Key",
      type: "string",
      description: "Pick an icon to represent this service area.",
      options: {
        list: [
          { title: "👥 People / Community", value: "Users" },
          { title: "🏢 Building / Org", value: "Building2" },
          { title: "💊 Health / Medical", value: "HeartPulse" },
          { title: "⚖️ Legal / Scale", value: "Scale" },
          { title: "💼 Employment", value: "Briefcase" },
          { title: "🎓 Education", value: "GraduationCap" },
          { title: "🌍 Global / Women Empowerment", value: "Globe2" },
          { title: "❤️ Heart / Compassion", value: "Heart" },
          { title: "🤝 Handshake / Partnership", value: "HeartHandshake" },
          { title: "📚 Book / Learning", value: "BookOpen" },
        ],
        layout: "dropdown",
      },
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
    select: {
      title: "title",
      subtitle: "description",
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
