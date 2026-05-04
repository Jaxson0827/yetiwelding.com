// =============================================================================
// SHOP IMAGE REGISTRY
//
// Single source of truth for every image used in the /shop microsite.
// Every component / data file imports from here.
//
// Assets live under /public/shop/<folder>/*.png. Update paths here when files
// are added or renamed.
//
// See public/shop/README.md for a human-readable slot list.
// =============================================================================

// ---------- Hero (landing page) ----------
// /public/shop/hero/landing.png
export const HERO_LANDING = '/shop/hero/landing.png';

// ---------- Categories ----------
// /public/shop/categories/<slug>.png
export const CAT_LANDSCAPE_EDGING = '/shop/categories/landscape-edging.png';
export const CAT_EDGING_ACCESSORIES = '/shop/categories/edging-accessories.png';
export const CAT_PLANTERS = '/shop/categories/planters.png';
export const CAT_FIRE_PITS = '/shop/categories/fire-pits.png';
export const CAT_THE_SIGN = '/shop/categories/the-sign.png';
export const CAT_TREE_RINGS = '/shop/categories/tree-rings.png';
export const CAT_RAISED_BEDS = '/shop/categories/raised-beds.png';

// ---------- Products (lead photo per product) ----------
// /public/shop/products/<slug>.png
export const PROD_EDGING_2FT = '/shop/products/edging-2ft.png';
export const PROD_EDGING_4FT = '/shop/products/edging-4ft.png';
export const PROD_EDGING_DRAIN = '/shop/products/edging-drain.png';
export const PROD_EDGING_BRIDGE = '/shop/products/edging-bridge.png';
export const PROD_EDGING_SHORT = '/shop/products/edging-short.png';
export const PROD_EDGING_START_FINISH = '/shop/products/edging-start-finish.png';
export const PROD_FIREPIT_BONFIRE = '/shop/products/firepit-bonfire.png';
export const PROD_FIREPIT_CAMPFIRE = '/shop/products/firepit-campfire.png';
export const PROD_SIGN_MODERN = '/shop/products/sign-modern.png';
export const PROD_SIGN_PREMIUM = '/shop/products/sign-premium.png';
export const PROD_PLANTER_GENERIC = '/shop/products/planter-generic.png';

// Optional extra angles for PDP galleries (same basename under /variants/)
export const PROD_FIREPIT_BONFIRE_EXTRA = '/shop/variants/firepit-bonfire-2.png';
export const PROD_FIREPIT_CAMPFIRE_EXTRA = '/shop/variants/firepit-campfire-2.png';

// ---------- Variant option thumbnails ----------
// /public/shop/variants/<key>.png
export const VAR_EDGING_H4 = '/shop/variants/edging-h4.png';
export const VAR_EDGING_H6 = '/shop/variants/edging-h6.png';
export const VAR_EDGING_H8 = '/shop/variants/edging-h8.png';
export const VAR_EDGING_H14 = '/shop/variants/edging-h14.png';
export const VAR_EDGING_BEND_STRAIGHT = '/shop/variants/edging-bend-straight.png';
export const VAR_EDGING_BEND_45 = '/shop/variants/edging-bend-45.png';
export const VAR_EDGING_BEND_90 = '/shop/variants/edging-bend-90.png';
// No separate small crops in /variants/ — use product leads for option cards.
export const VAR_FIREPIT_CAMPFIRE = PROD_FIREPIT_CAMPFIRE;
export const VAR_FIREPIT_BONFIRE = PROD_FIREPIT_BONFIRE;

// ---------- Mega-menu icons (small, square) ----------
// /public/shop/nav-icons/<key>.png
export const NAV_FAQ = '/shop/nav-icons/faq.png';
export const NAV_ABOUT_STEEL = '/shop/nav-icons/about-steel.png';
export const NAV_DATA_SHEETS = '/shop/nav-icons/data-sheets.png';
export const NAV_PRO_PROGRAM = '/shop/nav-icons/pro-program.png';
export const NAV_ABOUT_US = '/shop/nav-icons/about-us.png';
export const NAV_CONTACT = '/shop/nav-icons/contact.png';

// ---------- Mega-menu image cards ----------
// Dedicated nav-card art optional; reuse product/category PNGs until then.
export const NAVCARD_SIGN_MODERN = PROD_SIGN_MODERN;
export const NAVCARD_SIGN_PREMIUM = PROD_SIGN_PREMIUM;
export const NAVCARD_FIREPIT_BONFIRE = PROD_FIREPIT_BONFIRE;
export const NAVCARD_FIREPIT_CAMPFIRE = PROD_FIREPIT_CAMPFIRE;
// No dedicated install/video stills yet — use edging imagery that reads “on the job”.
export const NAVCARD_INSTALLATION_GUIDE = PROD_EDGING_START_FINISH;
export const NAVCARD_INSTALLATION_VIDEO = PROD_EDGING_BRIDGE;

// ---------- Editorial pages ----------
// Reuse on-hand shop PNGs until /public/shop/editorial/ is populated.
export const EDITORIAL_INSTALLATION_HERO = HERO_LANDING;
export const EDITORIAL_FAQ_HERO = CAT_FIRE_PITS;
export const EDITORIAL_ABOUT_STEEL_HERO = CAT_LANDSCAPE_EDGING;
export const EDITORIAL_ABOUT_DETAIL_1 = PROD_SIGN_PREMIUM;
export const EDITORIAL_ABOUT_DETAIL_2 = PROD_EDGING_4FT;

export const EDITORIAL_TOOL_WOOD_BLOCK = VAR_EDGING_BEND_STRAIGHT;
export const EDITORIAL_TOOL_HAMMER = VAR_EDGING_BEND_45;
export const EDITORIAL_TOOL_KNEE_PADS = VAR_EDGING_BEND_90;
export const EDITORIAL_TOOL_SAFETY = VAR_EDGING_H4;

export const EDITORIAL_INSTALL_KIT_PROMO = CAT_EDGING_ACCESSORIES;
export const EDITORIAL_STEP_PREPARE = PROD_EDGING_2FT;
export const EDITORIAL_STEP_POSITION = PROD_EDGING_4FT;
export const EDITORIAL_STEP_HAMMER = PROD_EDGING_DRAIN;
export const EDITORIAL_STEP_CONNECT = PROD_EDGING_BRIDGE;

// ---------- UGC / customer reviews grid ----------
// Built from in-repo shop art until real UGC lands in /public/shop/reviews/.
export const UGC_PHOTOS: string[] = [
  HERO_LANDING,
  CAT_LANDSCAPE_EDGING,
  CAT_EDGING_ACCESSORIES,
  CAT_PLANTERS,
  CAT_FIRE_PITS,
  CAT_THE_SIGN,
  CAT_TREE_RINGS,
  CAT_RAISED_BEDS,
  PROD_EDGING_2FT,
  PROD_EDGING_4FT,
  PROD_EDGING_DRAIN,
  PROD_EDGING_BRIDGE,
  PROD_FIREPIT_BONFIRE,
  PROD_FIREPIT_CAMPFIRE,
  PROD_SIGN_MODERN,
  PROD_SIGN_PREMIUM,
];

// ---------- Helper: build product gallery from a lead image + optional extras ----------
export function productGallery(leadPath: string, extras?: readonly string[]): string[] {
  const tail = (extras ?? []).filter((p) => p && p !== leadPath);
  return [leadPath, ...tail];
}
