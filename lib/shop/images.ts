// =============================================================================
// SHOP IMAGE REGISTRY
//
// Single source of truth for every image used in the /shop microsite.
// Every component / data file imports from here.
//
// HOW TO USE:
//   1. Drop your real images into the matching /public/shop/<folder>/ path
//      shown next to each constant (or any path you prefer).
//   2. Update the right-hand string of the slot you replaced.
//   3. The site automatically picks up the new image.
//
// While images are still being gathered, slots fall back to existing
// /public/projects/photoNN.jpg photos so the site keeps rendering.
//
// See public/shop/README.md for the human-readable shopping list.
// =============================================================================

// ---------- Hero (landing page) ----------
// Target: /public/shop/hero/landing.jpg   (recommended ~2400×900, lifestyle)
export const HERO_LANDING = '/projects/photo28.jpg';

// ---------- Categories ----------
// Target: /public/shop/categories/<slug>.jpg   (recommended ~1600×1000)
export const CAT_LANDSCAPE_EDGING   = '/projects/photo28.jpg';
export const CAT_EDGING_ACCESSORIES = '/projects/photo29.jpg';
export const CAT_PLANTERS           = '/projects/photo30.jpg';
export const CAT_FIRE_PITS          = '/projects/photo31.jpg';
export const CAT_THE_SIGN           = '/projects/photo32.jpg';
export const CAT_TREE_RINGS         = '/projects/photo33.jpg';
export const CAT_RAISED_BEDS        = '/garden_boxes/garden_box_hero.png';

// ---------- Products (lead photo per product) ----------
// Target: /public/shop/products/<slug>.jpg   (recommended ~1600×1600 square, product on neutral bg)
// Optional gallery extras: <slug>-2.jpg, <slug>-3.jpg, <slug>-4.jpg, <slug>-5.jpg
export const PROD_EDGING_2FT          = '/projects/photo28.jpg';
export const PROD_EDGING_4FT          = '/projects/photo29.jpg';
export const PROD_EDGING_DRAIN        = '/projects/photo30.jpg';
export const PROD_EDGING_BRIDGE       = '/projects/photo31.jpg';
export const PROD_EDGING_SHORT        = '/projects/photo34.jpg';
export const PROD_EDGING_START_FINISH = '/projects/photo35.jpg';
export const PROD_FIREPIT_BONFIRE     = '/projects/photo31.jpg';
export const PROD_FIREPIT_CAMPFIRE    = '/projects/photo37.jpg';
export const PROD_SIGN_MODERN         = '/projects/photo32.jpg';
export const PROD_SIGN_PREMIUM        = '/projects/photo36.jpg';
export const PROD_PLANTER_GENERIC     = '/projects/photo30.jpg';

// ---------- Variant option thumbnails ----------
// Target: /public/shop/variants/<key>.jpg   (recommended ~400×400, square crop)
export const VAR_EDGING_H4   = '/projects/photo31.jpg';
export const VAR_EDGING_H6   = '/projects/photo28.jpg';
export const VAR_EDGING_H8   = '/projects/photo29.jpg';
export const VAR_EDGING_H14  = '/projects/photo30.jpg';
export const VAR_EDGING_BEND_STRAIGHT = '/projects/photo28.jpg';
export const VAR_EDGING_BEND_45       = '/projects/photo29.jpg';
export const VAR_EDGING_BEND_90       = '/projects/photo30.jpg';
export const VAR_FIREPIT_CAMPFIRE     = '/projects/photo37.jpg';
export const VAR_FIREPIT_BONFIRE      = '/projects/photo31.jpg';

// ---------- Mega-menu icons (small, square) ----------
// Target: /public/shop/nav-icons/<key>.jpg   (recommended ~200×200)
// Most nav items reuse PROD_* / CAT_* images; the ones below are only for items
// that don't have a matching product/category (the "Learn" column).
export const NAV_FAQ          = '/projects/photo40.jpg';
export const NAV_ABOUT_STEEL  = '/projects/photo41.jpg';
export const NAV_DATA_SHEETS  = '/projects/photo42.jpg';
export const NAV_PRO_PROGRAM  = '/projects/photo43.jpg';
export const NAV_ABOUT_US     = '/homepage/featuredproject_night.jpg';
export const NAV_CONTACT      = '/projects/photo44.jpg';

// ---------- Mega-menu image cards (large, in image-card mega menus) ----------
// Target: /public/shop/nav-cards/<key>.jpg   (recommended ~680×400, 16:10)
export const NAVCARD_SIGN_MODERN        = '/projects/photo32.jpg';
export const NAVCARD_SIGN_PREMIUM       = '/projects/photo36.jpg';
export const NAVCARD_FIREPIT_BONFIRE    = '/projects/photo31.jpg';
export const NAVCARD_FIREPIT_CAMPFIRE   = '/projects/photo37.jpg';
export const NAVCARD_INSTALLATION_GUIDE = '/projects/photo38.jpg';
export const NAVCARD_INSTALLATION_VIDEO = '/projects/photo39.jpg';

// ---------- Editorial pages ----------
// Target: /public/shop/editorial/<key>.jpg
export const EDITORIAL_INSTALLATION_HERO = '/projects/photo38.jpg'; // 2400×900, action shot
export const EDITORIAL_FAQ_HERO          = '/projects/photo38.jpg'; // 2400×900, dark/textural
export const EDITORIAL_ABOUT_STEEL_HERO  = '/projects/photo41.jpg'; // 2400×900, COR-TEN closeup
export const EDITORIAL_ABOUT_DETAIL_1    = '/projects/photo36.jpg'; // 1600×900
export const EDITORIAL_ABOUT_DETAIL_2    = '/projects/photo42.jpg'; // 1600×900

// Tools grid (4 photos, square)
export const EDITORIAL_TOOL_WOOD_BLOCK = '/projects/photo38.jpg';
export const EDITORIAL_TOOL_HAMMER     = '/projects/photo39.jpg';
export const EDITORIAL_TOOL_KNEE_PADS  = '/projects/photo40.jpg';
export const EDITORIAL_TOOL_SAFETY     = '/projects/photo41.jpg';

// Promo insert + 4 process steps (4:3)
export const EDITORIAL_INSTALL_KIT_PROMO = '/projects/photo42.jpg';
export const EDITORIAL_STEP_PREPARE      = '/projects/photo28.jpg';
export const EDITORIAL_STEP_POSITION     = '/projects/photo29.jpg';
export const EDITORIAL_STEP_HAMMER       = '/projects/photo30.jpg';
export const EDITORIAL_STEP_CONNECT      = '/projects/photo31.jpg';

// ---------- UGC / customer reviews grid ----------
// Target: /public/shop/reviews/ugc-NN.jpg   (recommended ~600×600 square)
export const UGC_PHOTOS: string[] = [
  '/projects/photo28.jpg',
  '/projects/photo29.jpg',
  '/projects/photo30.jpg',
  '/projects/photo31.jpg',
  '/projects/photo33.jpg',
  '/projects/photo34.jpg',
  '/projects/photo35.jpg',
  '/projects/photo36.jpg',
  '/projects/photo37.jpg',
  '/projects/photo38.jpg',
  '/projects/photo39.jpg',
  '/projects/photo40.jpg',
  '/projects/photo41.jpg',
  '/projects/photo42.jpg',
  '/projects/photo43.jpg',
  '/projects/photo44.jpg',
];

// ---------- Helper: build product gallery from a lead image ----------
// Looks for <basePath>-2.jpg ... <basePath>-5.jpg by appending suffixes; while
// you have only one photo per product, this just returns [lead, lead, ...].
export function productGallery(leadPath: string): string[] {
  // For now, repeat the lead image so the gallery component still has 5 slots.
  // Once you have additional photos, return the full array of paths instead.
  return [leadPath, leadPath, leadPath, leadPath, leadPath];
}
