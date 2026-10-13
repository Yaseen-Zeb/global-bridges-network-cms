/**
 * Schema Type Registry
 * All Sanity document/object schemas are imported and exported here.
 * Import this array in sanity.config.ts → schema.types.
 */

import faq from "./faq";
import contactInfo from "./contactInfo";
import teamMember from "./teamMember";
import serviceArea from "./serviceArea";
import goodsItem from "./goodsItem";
import coreValue from "./coreValue";
import legalPage from "./legalPage";
import whatWeDo from "./whatWeDo";
import missionVision from "./missionVision";
import foundersJourney from "./foundersJourney";
import impactWays from "./impactWays";

export const schemaTypes = [
  // Collections
  serviceArea,
  whatWeDo,
  teamMember,
  coreValue,
  faq,
  goodsItem,
  // Singletons / fixed documents
  contactInfo,
  missionVision,
  foundersJourney,
  impactWays,
  legalPage,
];
