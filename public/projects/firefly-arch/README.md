# Firefly Arch Case Study — Photo Assets

Drop photos here using **exactly** these filenames. The case study page at
`/projects/firefly-arch` is already wired to these paths — no code changes needed.

| File | Section | Recommended size | Notes |
|---|---|---|---|
| `hero-day.jpg` | Hero (day) | 2400 × 1600 | Wide landscape shot; replaces homepage image for the case study hero |
| `hero-night.jpg` | Hero (night) | 2400 × 1600 | Night/lit version; replaces homepage image |
| `gallery-01.jpg` | Gallery (tall left) | 1000 × 1400 | Best portrait-oriented completed-arch shot |
| `gallery-02.jpg` | Gallery | 1600 × 1000 | Landscape or detail |
| `gallery-03.jpg` | Gallery | 1600 × 1000 | Another angle |
| `gallery-04.jpg` | Gallery (wide) | 2400 × 1000 | Wide / panoramic — spans 2 columns |
| `gallery-05.jpg` | Gallery | 1600 × 1000 | Detail or secondary view |
| `gallery-06.jpg` | Gallery (wide) | 2400 × 1000 | Night glow / lit — spans 2 columns |
| `process-01.jpg` | The Craft — Step 01 | 1600 × 1100 | Design / CAD / shop drawing |
| `process-02.jpg` | The Craft — Step 02 | 1600 × 1100 | Fabrication / cutting / welding |
| `process-03.jpg` | The Craft — Step 03 | 1600 × 1100 | Installation / on-site |
| `detail-holes.jpg` | Technical Specs | 1600 × 1000 | Close-up of the laser-cut hole pattern |
| `detail-structure.jpg` | Technical Specs | 1600 × 1000 | Structural / HSS / weld detail |

**Hero note:** The page currently uses `/homepage/featuredproject.JPG` and
`/homepage/featuredproject_night.jpg` as hero fallbacks so the top of the page
renders immediately. Once you add `hero-day.jpg` and `hero-night.jpg` here,
update the `HERO_DAY` and `HERO_NIGHT` constants at the top of
`components/projects/FireflyArchCaseStudy.tsx` to point to these new paths.
