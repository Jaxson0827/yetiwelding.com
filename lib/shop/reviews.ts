import { Review } from './types';

// 9 sample reviews verbatim from the spec.
export const homepageReviews: Review[] = [
  {
    title: "You Can't Go Wrong",
    body: 'Great quality and ease of installation.',
    authorName: 'Gregory Moulton',
    authorReviewCount: 1,
    timeAgo: '15 hours ago',
    stars: 5,
  },
  {
    title: 'Great Products',
    body: 'Great Products, Fast Shipping',
    authorName: 'Ed Lehotay',
    authorReviewCount: 2,
    timeAgo: '16 hours ago',
    stars: 5,
  },
  {
    title: 'Great product!',
    body: 'Great product!',
    authorName: 'Deborah Reed',
    authorReviewCount: 4,
    timeAgo: '21 hours ago',
    stars: 5,
  },
  {
    title: 'The product was delivered as promised…',
    body: 'The product was delivered as promised and in stock. Instillation was easy and straight forward.',
    authorName: 'A Martin',
    authorReviewCount: 4,
    timeAgo: '23 hours ago',
    stars: 5,
  },
  {
    title: 'Game changer!',
    body: "We ordered the large house numbers steel yard sign and it did not disappoint! Great quality craftsmanship (seriously this thing will likely outlast us!) It's beautiful now but I can't wait for the patina too. A great addition to our exterior home and landscape remodel, the icing on the cake!",
    authorName: 'Marci Jenks',
    authorReviewCount: 1,
    timeAgo: '1 day ago',
    stars: 5,
  },
  {
    title: 'Fast delivery',
    body: 'Fast delivery, quality construction, easy installation.',
    authorName: 'Robin Smith',
    authorReviewCount: 1,
    timeAgo: '1 day ago',
    stars: 5,
  },
  {
    title: 'The product is great',
    body: 'The product is great - it looks great, and is easy to install.',
    authorName: 'Andrew Nagy',
    authorReviewCount: 4,
    timeAgo: '1 day ago',
    stars: 5,
  },
  {
    title: 'Great product',
    body: 'Great product, great service',
    authorName: 'indei',
    authorReviewCount: 2,
    timeAgo: '1 day ago',
    stars: 5,
  },
  {
    title: 'Exactly as described',
    body: 'Exactly as described, great material, worked as expected.',
    authorName: 'Jarrod Riggs',
    authorReviewCount: 1,
    timeAgo: '1 day ago',
    stars: 5,
  },
];

export const aggregate = {
  rating: 4.8,
  totalReviews: 3474,
  remainingReviews: 3465,
};
