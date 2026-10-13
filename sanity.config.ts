import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes/index";
import { LIST_DOCUMENTS } from "./schemaTypes/lists";

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
            // Singleton: footer, contact panels, form settings
            S.listItem()
              .title("Contact & Site Settings")
              .id("contactInfo")
              .icon(() => "📬")
              .child(S.document().schemaType("contactInfo").documentId("contactInfo")),

            S.listItem()
              .title("Mission & Vision")
              .id("missionVision")
              .icon(() => "🎯")
              .child(S.document().schemaType("missionVision").documentId("missionVision")),
            S.listItem()
              .title("Founders Journey")
              .id("foundersJourney")
              .icon(() => "🧭")
              .child(S.document().schemaType("foundersJourney").documentId("foundersJourney")),
            S.listItem()
              .title("Four Ways (Donate page)")
              .id("impactWays")
              .icon(() => "🙌")
              .child(S.document().schemaType("impactWays").documentId("impactWays")),
            S.listItem()
              .title("Supporting Our Work (Donate page)")
              .id("supportWays")
              .icon(() => "🤲")
              .child(S.document().schemaType("supportWays").documentId("supportWays")),

            // Lists: one document each, items edited and reordered inside it
            ...LIST_DOCUMENTS.map(({ id, type, title, icon }) =>
              S.listItem()
                .title(title)
                .id(id)
                .icon(() => icon)
                .child(S.document().schemaType(type).documentId(id))
            ),

            // Legal pages: two fixed documents of the same type
            S.listItem()
              .title("Privacy Policy")
              .id("privacyPolicy")
              .icon(() => "🔒")
              .child(S.document().schemaType("legalPage").documentId("privacyPolicy")),
            S.listItem()
              .title("Terms & Conditions")
              .id("termsAndConditions")
              .icon(() => "📜")
              .child(S.document().schemaType("legalPage").documentId("termsAndConditions")),
          ]),
    }),

    // GROQ query playground — only in dev
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Every document is a fixed one pinned in the menu, so nothing is created from the "+" menu.
    templates: () => [],
  },
});
