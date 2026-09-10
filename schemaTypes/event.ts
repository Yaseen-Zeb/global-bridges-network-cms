import { defineField, defineType } from "sanity";

/**
 * Event Schema
 * Mirrors: frontend/src/data/events.ts → EventItem interface
 *
 * Fields:
 *  title           – Event title
 *  description     – Short description
 *  category        – Event type (workshop / community / volunteer-drive / webinar)
 *  date            – Human-readable date string (e.g. "April 12, 2025")
 *  time            – Human-readable time range (e.g. "10:00 AM – 12:30 PM EST")
 *  location        – Venue name or "Online"
 *  status          – upcoming | past
 *  image           – Event cover image (Sanity image asset)
 *  registrationUrl – Internal path or external URL for registration
 *  published       – Toggle to show/hide from the website
 */
export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: () => "📅",
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Workshop", value: "workshop" },
          { title: "Community", value: "community" },
          { title: "Volunteer Drive", value: "volunteer-drive" },
          { title: "Webinar", value: "webinar" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "string",
      description: 'Human-readable date, e.g. "April 12, 2025".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      description: 'Time range, e.g. "10:00 AM – 12:30 PM EST".',
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'Venue name, address, or "Global Online Webinar".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Upcoming", value: "upcoming" },
          { title: "Past", value: "past" },
        ],
        layout: "radio",
      },
      initialValue: "upcoming",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "registrationUrl",
      title: "Registration URL",
      type: "string",
      description: 'Internal path (e.g. "/contact") or full external URL.',
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "Only published events appear on the website.",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "date",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Date (newest first)",
      name: "dateDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
