import { defineArrayMember, defineField, defineType, useFormValue } from "sanity";

/** Field hint whose example matches the page being edited. */
function OverlineHint() {
  const id = useFormValue(["_id"]) as string | undefined;
  const example = id?.includes("termsAndConditions") ? "Terms & Conditions" : "Privacy Policy";
  return <>Small label above the title, e.g. &ldquo;{example}&rdquo;.</>;
}

/**
 * Legal Page — Privacy Policy and Terms & Conditions.
 * Two fixed documents (ids "privacyPolicy" and "termsAndConditions") pinned in the studio.
 */
export default defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  icon: () => "📄",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Overline",
      type: "string",
      description: <OverlineHint />,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleLines",
      title: "Title",
      type: "array",
      description: "Each item is one line of the page title.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: "description",
      title: "Intro",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      description: "Numbered automatically in this order.",
      of: [
        defineArrayMember({
          type: "object",
          name: "legalSection",
          fields: [
            defineField({ name: "title", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "paragraphs",
              title: "Paragraphs",
              type: "array",
              of: [defineArrayMember({ type: "text", rows: 3 })],
            }),
            defineField({
              name: "intro",
              title: "List Intro",
              type: "string",
              description: 'Sentence shown right before the bullet list, e.g. "You must not:".',
            }),
            defineField({
              name: "bullets",
              title: "Bullet List",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "outro",
              title: "Closing Paragraph",
              type: "text",
              rows: 2,
              description: "Optional paragraph after the bullet list.",
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "eyebrow", subtitle: "lastUpdated" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `Last updated ${subtitle}` : undefined };
    },
  },
});
