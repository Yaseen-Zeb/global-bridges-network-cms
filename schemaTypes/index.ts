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

export const schemaTypes = [
  // Collections
  testimonial,
  currentNeed,
  event,
  faq,
  // Singleton
  contactInfo,
];
