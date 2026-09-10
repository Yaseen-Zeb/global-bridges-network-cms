import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes/index";

export default defineConfig({
  name: "global-bridges-network",
  title: "Global Bridges Network",

  projectId: "u32ec3wv",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton: Contact Info
            S.listItem()
              .title("Contact Information")
              .id("contactInfo")
              .child(
                S.document()
                  .schemaType("contactInfo")
                  .documentId("contactInfo")
              ),

            S.divider(),

            // Collections
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("currentNeed").title("Current Needs"),
            S.documentTypeListItem("event").title("Events"),
            S.documentTypeListItem("faq").title("FAQs"),
          ]),
    }),

    // GROQ query playground — only in dev
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
