import { defineField, defineType } from "sanity";

/**
 * Current Need Schema
 * Mirrors: frontend/src/data/current-needs.ts → CurrentNeed interface
 *
 * Founders use this to update the "Current Needs" section of the website
 * without any code changes. Only active needs are displayed.
 *
 * Fields:
 *  itemName     – Name of the needed item
 *  description  – Short description of the item and its use
 *  category     – Donation category label
 *  quantity     – Human-readable quantity string (e.g. "15 Starter Sets")
 *  priority     – Urgency level shown on the card
 *  image        – Photo of the item (Sanity image asset)
 *  lastUpdated  – Human-readable date string (e.g. "March 2025")
 *  active       – Only active needs are shown on the website
 */
export default defineType({
  name: "currentNeed",
  title: "Current Need",
  type: "document",
  icon: () => "📦",
  fields: [
    defineField({
      name: "itemName",
      title: "Item Name",
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
      name: "category",
      title: "Category",
      type: "string",
      description: 'E.g. "Kitchen & Dining", "Clothing & Outerwear"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quantity",
      title: "Quantity Needed",
      type: "string",
      description: 'Human-readable quantity, e.g. "15 Starter Sets" or "High Priority".',
    }),
    defineField({
      name: "priority",
      title: "Priority Level",
      type: "string",
      options: {
        list: [
          { title: "🔴 Urgent", value: "urgent" },
          { title: "🟠 High", value: "high" },
          { title: "🟡 Medium", value: "medium" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "image",
      title: "Item Photo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "string",
      description: 'Human-readable date, e.g. "March 2025".',
    }),
    defineField({
      name: "active",
      title: "Active (show on website)",
      type: "boolean",
      description: "Uncheck to hide this need without deleting it.",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "itemName",
      subtitle: "priority",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      const priorityMap: Record<string, string> = {
        urgent: "🔴 Urgent",
        high: "🟠 High",
        medium: "🟡 Medium",
      };
      return {
        title,
        subtitle: priorityMap[subtitle] ?? subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Priority (urgent first)",
      name: "priorityAsc",
      by: [{ field: "priority", direction: "asc" }],
    },
  ],
});
