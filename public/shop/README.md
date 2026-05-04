# Shop Image Folder — Yeti Steel Goods (`/shop`)

All images for the `/shop` micro-site live under this folder. To swap a placeholder
for a real photo, drop the new file into the matching subfolder and (if you don't
match the suggested filename) update the matching constant in
[`lib/shop/images.ts`](../../lib/shop/images.ts).

While images are still being gathered, every slot falls back to existing
`/public/projects/photoNN.jpg` photos so the site keeps rendering. Replace at
your own pace — there's no all-or-nothing requirement.

---

## Folder structure

```
public/shop/
├── hero/                   landing-page hero banner
├── categories/             one image per category card (used for hero + thumb)
├── products/               product gallery photos (one per product, plus optional -2..-5)
├── variants/               small option-card thumbnails on product detail pages
├── nav-icons/              tiny icons that appear in column-style mega-menus
├── nav-cards/              big image cards in image-style mega-menus
├── editorial/              installation / faq / about-steel hero + step photos
└── reviews/                customer photo grid (UGC) thumbnails
```

---

## 1. Hero (1 image)

| Slot | File path | Recommended size | Use |
|---|---|---|---|
| `HERO_LANDING` | `hero/landing.jpg` | ~2400 × 900 | Full-bleed background on `/shop` landing page |

## 2. Categories (7 images)

| Slot | File path | Recommended size | Use |
|---|---|---|---|
| `CAT_LANDSCAPE_EDGING` | `categories/landscape-edging.jpg` | ~1600 × 1000 | Edging category card + collection hero |
| `CAT_EDGING_ACCESSORIES` | `categories/edging-accessories.jpg` | ~1600 × 1000 | Accessories category card + collection hero |
| `CAT_PLANTERS` | `categories/planters.jpg` | ~1600 × 1000 | Planters category card + collection hero |
| `CAT_FIRE_PITS` | `categories/fire-pits.jpg` | ~1600 × 1000 | Fire pits category card + collection hero |
| `CAT_THE_SIGN` | `categories/the-sign.jpg` | ~1600 × 1000 | The Sign category card + collection hero |
| `CAT_TREE_RINGS` | `categories/tree-rings.jpg` | ~1600 × 1000 | Tree rings category card + collection hero |
| `CAT_RAISED_BEDS` | `categories/raised-beds.jpg` | ~1600 × 1000 | Raised beds category card + collection hero |

## 3. Products (11 lead photos minimum)

Each product needs **at least one** lead photo. Optional gallery extras:
add `-2.jpg`, `-3.jpg`, `-4.jpg`, `-5.jpg` next to the lead in `products/`
and update the `productGallery()` helper in `lib/shop/images.ts` to include
them.

| Slot | File path | Recommended size | Product page |
|---|---|---|---|
| `PROD_EDGING_2FT` | `products/edging-2ft.jpg` | ~1600 × 1600 (square) | The Edging 2-FT |
| `PROD_EDGING_4FT` | `products/edging-4ft.jpg` | ~1600 × 1600 | The Edging 4-FT |
| `PROD_EDGING_DRAIN` | `products/edging-drain.jpg` | ~1600 × 1600 | 2-FT Drain |
| `PROD_EDGING_BRIDGE` | `products/edging-bridge.jpg` | ~1600 × 1600 | 2-FT Bridge |
| `PROD_EDGING_SHORT` | `products/edging-short.jpg` | ~1600 × 1600 | >1-FT Edging |
| `PROD_EDGING_START_FINISH` | `products/edging-start-finish.jpg` | ~1600 × 1600 | Start/Finish caps |
| `PROD_FIREPIT_BONFIRE` | `products/firepit-bonfire.jpg` | ~1600 × 1600 | The Bonfire |
| `PROD_FIREPIT_CAMPFIRE` | `products/firepit-campfire.jpg` | ~1600 × 1600 | The Campfire |
| `PROD_SIGN_MODERN` | `products/sign-modern.jpg` | ~1600 × 1600 | Modern Address Sign |
| `PROD_SIGN_PREMIUM` | `products/sign-premium.jpg` | ~1600 × 1600 | Premium Address Sign |
| `PROD_PLANTER_GENERIC` | `products/planter-generic.jpg` | ~1600 × 1600 | All 11 planter products (replace per-product later) |

## 4. Variant option thumbnails (9 images)

Small square thumbnails inside option cards on product detail pages.

| Slot | File path | Recommended size | Variant |
|---|---|---|---|
| `VAR_EDGING_H4` | `variants/edging-h4.jpg` | ~400 × 400 | 4-inch edging height |
| `VAR_EDGING_H6` | `variants/edging-h6.jpg` | ~400 × 400 | 6-inch edging height |
| `VAR_EDGING_H8` | `variants/edging-h8.jpg` | ~400 × 400 | 8-inch edging height |
| `VAR_EDGING_H14` | `variants/edging-h14.jpg` | ~400 × 400 | 14-inch edging height |
| `VAR_EDGING_BEND_STRAIGHT` | `variants/edging-bend-straight.jpg` | ~400 × 400 | Straight bend |
| `VAR_EDGING_BEND_45` | `variants/edging-bend-45.jpg` | ~400 × 400 | 45° bend |
| `VAR_EDGING_BEND_90` | `variants/edging-bend-90.jpg` | ~400 × 400 | 90° bend |
| `VAR_FIREPIT_CAMPFIRE` | `variants/firepit-campfire.jpg` | ~400 × 400 | Campfire size |
| `VAR_FIREPIT_BONFIRE` | `variants/firepit-bonfire.jpg` | ~400 × 400 | Bonfire size |

## 5. Mega-menu icons (6 images)

Small thumbnails in the desktop "Learn" mega-menu. Most other nav items reuse
the product/category images above.

| Slot | File path | Recommended size | Menu item |
|---|---|---|---|
| `NAV_FAQ` | `nav-icons/faq.jpg` | ~200 × 200 | Frequently Asked Questions |
| `NAV_ABOUT_STEEL` | `nav-icons/about-steel.jpg` | ~200 × 200 | What is COR-TEN Steel? |
| `NAV_DATA_SHEETS` | `nav-icons/data-sheets.jpg` | ~200 × 200 | Yeti Data Sheets |
| `NAV_PRO_PROGRAM` | `nav-icons/pro-program.jpg` | ~200 × 200 | Yeti Pro / Trade |
| `NAV_ABOUT_US` | `nav-icons/about-us.jpg` | ~200 × 200 | About Us |
| `NAV_CONTACT` | `nav-icons/contact.jpg` | ~200 × 200 | Contact Us |

## 6. Mega-menu image cards (6 images)

Large image cards used in the "image-card" style mega-menus (Sign, Firepit, Installation).

| Slot | File path | Recommended size | Card |
|---|---|---|---|
| `NAVCARD_SIGN_MODERN` | `nav-cards/sign-modern.jpg` | ~680 × 400 (16:10) | Modern Address Sign |
| `NAVCARD_SIGN_PREMIUM` | `nav-cards/sign-premium.jpg` | ~680 × 400 | Premium Address Sign |
| `NAVCARD_FIREPIT_BONFIRE` | `nav-cards/firepit-bonfire.jpg` | ~680 × 400 | The Bonfire |
| `NAVCARD_FIREPIT_CAMPFIRE` | `nav-cards/firepit-campfire.jpg` | ~680 × 400 | The Campfire |
| `NAVCARD_INSTALLATION_GUIDE` | `nav-cards/installation-guide.jpg` | ~680 × 400 | Installation Guide |
| `NAVCARD_INSTALLATION_VIDEO` | `nav-cards/installation-video.jpg` | ~680 × 400 | Installation Video still |

## 7. Editorial pages (14 images)

| Slot | File path | Recommended size | Page section |
|---|---|---|---|
| `EDITORIAL_INSTALLATION_HERO` | `editorial/installation-hero.jpg` | ~2400 × 900 | `/shop/installation` hero |
| `EDITORIAL_FAQ_HERO` | `editorial/faq-hero.jpg` | ~2400 × 900 | `/shop/faq` hero |
| `EDITORIAL_ABOUT_STEEL_HERO` | `editorial/about-steel-hero.jpg` | ~2400 × 900 | `/shop/about-steel` hero |
| `EDITORIAL_ABOUT_DETAIL_1` | `editorial/about-steel-detail-1.jpg` | ~1600 × 900 | About-Steel mid-page photo |
| `EDITORIAL_ABOUT_DETAIL_2` | `editorial/about-steel-detail-2.jpg` | ~1600 × 900 | About-Steel iconic-architecture photo |
| `EDITORIAL_TOOL_WOOD_BLOCK` | `editorial/tools-wood-block.jpg` | ~800 × 800 | Installation: tools grid |
| `EDITORIAL_TOOL_HAMMER` | `editorial/tools-hammer.jpg` | ~800 × 800 | Installation: tools grid |
| `EDITORIAL_TOOL_KNEE_PADS` | `editorial/tools-knee-pads.jpg` | ~800 × 800 | Installation: tools grid |
| `EDITORIAL_TOOL_SAFETY` | `editorial/tools-safety.jpg` | ~800 × 800 | Installation: tools grid |
| `EDITORIAL_INSTALL_KIT_PROMO` | `editorial/install-kit-promo.jpg` | ~600 × 600 | Installation: promo insert thumbnail |
| `EDITORIAL_STEP_PREPARE` | `editorial/step-01-prepare.jpg` | ~1200 × 900 (4:3) | Installation: step 01 |
| `EDITORIAL_STEP_POSITION` | `editorial/step-02-position.jpg` | ~1200 × 900 | Installation: step 02 |
| `EDITORIAL_STEP_HAMMER` | `editorial/step-03-hammer.jpg` | ~1200 × 900 | Installation: step 03 |
| `EDITORIAL_STEP_CONNECT` | `editorial/step-04-connect.jpg` | ~1200 × 900 | Installation: step 04 |

## 8. Customer photo grid / UGC (16 images)

Square thumbnails shown in the "Customer Photos & Videos" grid on every product
detail page. Real customer install photos work best here.

| Slot | File path | Recommended size |
|---|---|---|
| `UGC_PHOTOS[0]` | `reviews/ugc-01.jpg` | ~600 × 600 |
| `UGC_PHOTOS[1]` | `reviews/ugc-02.jpg` | ~600 × 600 |
| `UGC_PHOTOS[2]` | `reviews/ugc-03.jpg` | ~600 × 600 |
| ... | ... | ... |
| `UGC_PHOTOS[15]` | `reviews/ugc-16.jpg` | ~600 × 600 |

---

## Totals

| Section | Image count | Required to launch |
|---|---|---|
| Hero | 1 | yes |
| Categories | 7 | yes |
| Products (lead) | 11 | yes |
| Variants | 9 | nice-to-have |
| Nav icons | 6 | nice-to-have |
| Nav cards | 6 | nice-to-have |
| Editorial | 14 | yes (for editorial pages) |
| UGC | 16 | nice-to-have |
| **Total** | **70** | **~33 must-haves** |

You can ship with fewer than 70 — anything you don't replace stays on the
existing `/projects/` placeholder photos automatically.
