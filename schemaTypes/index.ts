/**
 * Schema Type Registry
 * All Sanity document/object schemas are imported and exported here.
 * Import this array in sanity.config.ts → schema.types.
 */

import testimonial from "./testimonial";
import currentNeed from "./currentNeed";
import event from "./event";
import faq from "./faq";
import contactInfo from "./contactInfo";
import teamMember from "./teamMember";
import foundingStory from "./foundingStory";
import serviceArea from "./serviceArea";

export const schemaTypes = [
  // Collections
  testimonial,
  currentNeed,
  event,
  faq,
  teamMember,
  serviceArea,
  // Singletons
  contactInfo,
  foundingStory,
];

