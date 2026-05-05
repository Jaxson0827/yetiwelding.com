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

// Second angle for planter PDPs (product lead lives under /products/)
export const PROD_PLANTER_GENERIC_EXTRA = '/shop/variants/planter-generic.png';

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
// /public/shop/nav-cards/<key>.png
export const NAVCARD_SIGN_MODERN = '/shop/nav-cards/nav-cards-sign-modern.png';
export const NAVCARD_SIGN_PREMIUM = '/shop/nav-cards/nav-cards-sign-premium.png';
export const NAVCARD_FIREPIT_BONFIRE = '/shop/nav-cards/nav-cards-firepit-bonfire.png';
export const NAVCARD_FIREPIT_CAMPFIRE = '/shop/nav-cards/nav-cards-firepit-campfire.png';
export const NAVCARD_INSTALLATION_GUIDE = '/shop/nav-cards/nav-cards-installation-guide.png';
export const NAVCARD_INSTALLATION_VIDEO = '/shop/nav-cards/nav-cards-installation-video.png';

// ---------- Editorial pages ----------
// /public/shop/editorial/<key>.png (step 04 asset not in bundle — reuse edging bridge shot)
export const EDITORIAL_INSTALLATION_HERO = '/shop/editorial/editorial-installation-hero.png';
export const EDITORIAL_FAQ_HERO = '/shop/editorial/editorial-faq-hero.png';
export const EDITORIAL_ABOUT_STEEL_HERO = '/shop/editorial/editorial-about-steel-hero.png';
export const EDITORIAL_ABOUT_DETAIL_1 = '/shop/editorial/editorial-about-steel-detail-1.png';
export const EDITORIAL_ABOUT_DETAIL_2 = '/shop/editorial/editorial-about-steel-detail-2.png';

export const EDITORIAL_TOOL_WOOD_BLOCK = '/shop/editorial/editorial-tools-wood-block.png';
export const EDITORIAL_TOOL_HAMMER = '/shop/editorial/editorial-tools-hammer.png';
export const EDITORIAL_TOOL_KNEE_PADS = '/shop/editorial/editorial-tools-knee-pads.png';
export const EDITORIAL_TOOL_SAFETY = '/shop/editorial/editorial-tools-safety.png';

export const EDITORIAL_INSTALL_KIT_PROMO = '/shop/editorial/editorial-install-kit-promo.png';
export const EDITORIAL_STEP_PREPARE = '/shop/editorial/editorial-step-01-prepare.png';
export const EDITORIAL_STEP_POSITION = '/shop/editorial/editorial-step-02-position.png';
export const EDITORIAL_STEP_HAMMER = '/shop/editorial/editorial-step-03-hammer.png';
export const EDITORIAL_STEP_CONNECT = PROD_EDGING_BRIDGE;

// ---------- UGC / customer reviews grid ----------
// /public/shop/reviews/reviews-ugc-01.png … reviews-ugc-16.png
export const UGC_PHOTOS: string[] = Array.from({ length: 16 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return `/shop/reviews/reviews-ugc-${n}.png`;
});

// ---------- Helper: build product gallery from a lead image + optional extras ----------
export function productGallery(leadPath: string, extras?: readonly string[]): string[] {
  const tail = (extras ?? []).filter((p) => p && p !== leadPath);
  return [leadPath, ...tail];
}
