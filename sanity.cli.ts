import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "u32ec3wv",
    dataset: "production",
  },
  /**
   * Enable auto-updates for the Sanity Studio.
   * https://www.sanity.io/changelog
   */
  autoUpdates: true,
});
