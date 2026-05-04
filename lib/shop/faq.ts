export interface FaqQuestion {
  q: string;
  a: string;
}

export interface FaqSection {
  title: string;
  subtitle: string;
  questions: FaqQuestion[];
}

export const faqSections: FaqSection[] = [
  {
    title: 'Installation',
    subtitle: 'Common questions about installing Yeti landscape edging',
    questions: [
      {
        q: 'How do I measure the area for my edging project?',
        a: 'Walk the perimeter of the area you want to edge with a flexible measuring tape. Round up to the nearest foot to account for cuts, overlaps at connectors, and any minor adjustments during installation.',
      },
      {
        q: 'Is this product too thick to curve or bend?',
        a: 'No. Standing the material on its end and applying steady pressure to the middle lets you flex it into a smooth curve. For sharp bends use a wood block as a fulcrum.',
      },
      {
        q: 'How deep do grass roots/rhizomes go?',
        a: 'Most lawn grasses keep their rhizomes within the top 2 inches of soil, so 4–6 inches of buried edging is plenty for the majority of yards.',
      },
      {
        q: 'Could I hit my sprinkler lines?',
        a: 'Yes, you can. We recommend marking your irrigation lines before installation and pre-trenching with a shovel where there is any doubt.',
      },
      {
        q: 'What can I use to trim the material?',
        a: 'Standard metal-cutting tools work well: an angle grinder with a metal cut-off wheel, a metal-blade reciprocating saw, or a chop saw with a ferrous blade.',
      },
      {
        q: 'Can I use a rubber mallet to hammer in the edging?',
        a: 'A rubber mallet is OK for soft soil but you will work much faster with a steel hammer driven through a wood block placed on top of the spine.',
      },
      {
        q: 'Can Yeti steel edging be installed in rocky soil?',
        a: 'It can, but you will need to pre-trench through the rocky areas. The teeth are designed for soil — they will not split rocks.',
      },
    ],
  },
  {
    title: 'About COR-TEN',
    subtitle: 'Common questions about COR-TEN weathering steel',
    questions: [
      {
        q: 'What is the difference between COR-TEN and mild steel?',
        a: 'COR-TEN steel develops a stable, protective rust patina that shields the metal beneath. Mild steel rusts continuously and weakens over time. COR-TEN is engineered to weather, mild steel is not.',
      },
      {
        q: 'Can I stop this product from rusting?',
        a: 'Yes. Sealants like Owatrol Floetrol or EVERBRITE can be applied to a clean, dry surface to slow or pause the patina process.',
      },
      {
        q: 'Can I make this product rust faster?',
        a: 'Yes. Spraying the surface with a vinegar/salt/hydrogen peroxide solution will accelerate the patina dramatically. Always rinse and let the steel dry between treatments.',
      },
      {
        q: 'Will the top portion of the barrier be damaged by weed eaters?',
        a: 'Light contact will not hurt the steel. Sustained string-trimmer contact may scuff the patina temporarily, but it self-heals as the surface re-weathers.',
      },
      {
        q: 'Can I paint COR-TEN steel?',
        a: 'You can, but most customers prefer the natural patina. If you do paint, use a self-etching primer first to ensure adhesion.',
      },
      {
        q: 'Will COR-TEN edging stain my concrete?',
        a: 'Runoff from heavily weathering steel can leave orange streaks on porous surfaces. We recommend keeping a 1-inch gap between the edging and any concrete you want to keep clean, or sealing the steel surface.',
      },
    ],
  },
  {
    title: 'Ordering & Shipping',
    subtitle: 'Common questions about orders and delivery',
    questions: [
      {
        q: 'What does shipping cost?',
        a: 'Standard shipping is free on most orders. Larger pieces and freight items have shipping calculated at checkout based on destination.',
      },
      {
        q: 'Do you offer expedited shipping?',
        a: 'Yes. Expedited options are shown at checkout when available. For tight schedules, contact us — our trade program offers priority fulfillment.',
      },
    ],
  },
];
