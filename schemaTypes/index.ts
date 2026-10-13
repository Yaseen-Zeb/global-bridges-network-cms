/**
 * Schema Type Registry
 * All Sanity document/object schemas are imported and exported here.
 * Import this array in sanity.config.ts → schema.types.
 */

import contactInfo from "./contactInfo";
import missionVision from "./missionVision";
import foundersJourney from "./foundersJourney";
import impactWays from "./impactWays";
import supportWays from "./supportWays";
import legalPage from "./legalPage";
import { coreValuesList, faqList, goodsList, leadershipList, servicesList, whatWeDoList } from "./lists";

// Every type is a fixed document pinned in the Studio menu (see sanity.config.ts).
export const schemaTypes = [
  contactInfo,
  missionVision,
  foundersJourney,
  impactWays,
  supportWays,
  servicesList,
  whatWeDoList,
  leadershipList,
  coreValuesList,
  faqList,
  goodsList,
  legalPage,
];
