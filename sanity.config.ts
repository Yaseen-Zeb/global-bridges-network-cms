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

            // Pages
            S.documentTypeListItem("serviceArea").title("Services"),
            S.documentTypeListItem("whatWeDo").title("What We Do (About page)"),
            S.documentTypeListItem("teamMember").title("Founders & Leadership"),
            S.documentTypeListItem("coreValue").title("Core Values"),
            S.documentTypeListItem("faq").title("FAQs"),
            S.documentTypeListItem("goodsItem").title("Goods We Accept / Decline"),

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
    // Singletons / fixed documents can't be created from the "+" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !["contactInfo", "missionVision", "foundersJourney", "impactWays", "supportWays", "legalPage"].includes(schemaType)),
  },
});
