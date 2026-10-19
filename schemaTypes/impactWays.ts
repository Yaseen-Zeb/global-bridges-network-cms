import { defineArrayMember, defineField, defineType } from "sanity";
import { TITLE_HINT } from "./missionVision";

const ICONS = [
  { title: "👥 People / Volunteer", value: "volunteer" },
  { title: "📦 Box / Goods", value: "goods" },
  { title: "🤝 Handshake / Partner", value: "partner" },
  { title: "📣 Megaphone / Share", value: "share" },
  { title: "❤️ Heart / Donate", value: "heart" },
  { title: "🎁 Gift", value: "gift" },
];

/**
 * Four Ways — singleton (documentId: "impactWays").
 * The stacked photo cards in "Four Ways You Can Make an Impact" on the Donate page.
 * Only the cards are managed here; the section heading lives in the website code.
 */
export default defineType({
  name: "impactWays",
  title: "Four Ways (Donate page)",
  type: "document",
  icon: () => "🙌",
  fields: [
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      description: "Each card stacks over the previous one while scrolling. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "impactCard",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: { list: ICONS, layout: "dropdown" },
              initialValue: "heart",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "title", title: "Title", type: "text", rows: 2, description: TITLE_HINT, validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Text", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the photo for screen readers." })],
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "buttonLabel", title: "Button Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "buttonAction",
              title: "Button Action",
              type: "string",
              options: {
                list: [
                  { title: "Go to a link", value: "link" },
                  { title: "Open a tab in the Donate panel above", value: "tab" },
                  { title: "Share the website", value: "share" },
                ],
                layout: "radio",
              },
              initialValue: "link",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "buttonHref",
              title: "Link",
              type: "string",
              description: 'A page path like "/contact", a section like "#accepted-goods", or a full https:// URL.',
              hidden: ({ parent }) => parent?.buttonAction !== "link",
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  (context.parent as { buttonAction?: string } | undefined)?.buttonAction === "link" && !value
                    ? "Add a link for this button."
                    : true
                ),
            }),
            defineField({
              name: "buttonTab",
              title: "Tab to Open",
              type: "string",
              options: {
                list: [
                  { title: "Donate Goods", value: "goods" },
                  { title: "Donate Money", value: "money" },
                  { title: "Volunteer (opens the Volunteer page)", value: "volunteer" },
                ],
                layout: "radio",
              },
              hidden: ({ parent }) => parent?.buttonAction !== "tab",
              validation: (Rule) =>
                Rule.custom((value, context) =>
                  (context.parent as { buttonAction?: string } | undefined)?.buttonAction === "tab" && !value
                    ? "Choose which tab to open."
                    : true
                ),
            }),
          ],
          preview: { select: { title: "title", subtitle: "buttonLabel", media: "image" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Four Ways (Donate page)" };
    },
  },
});
