import type { BalanceSummary, Category, ProductSection } from './types';

/**
 * Static demo content for the home screen. In production these values come
 * from the API via a service + React Query hook; the shapes match `types.ts`
 * so the UI does not change when the data source is swapped.
 */

const productImages = {
  p1: require('../../../assets/images/home/products/p1.png'),
  p2: require('../../../assets/images/home/products/p2.png'),
  p3: require('../../../assets/images/home/products/p3.png'),
  p4: require('../../../assets/images/home/products/p4.png'),
  p5: require('../../../assets/images/home/products/p5.png'),
  p6: require('../../../assets/images/home/products/p6.png'),
  p7: require('../../../assets/images/home/products/p7.png'),
} as const;

export const homeCategories: Category[] = [
  { id: 'all', label: 'All', icon: require('../../../assets/images/home/categories/all.png') },
  { id: 'food', label: 'Food', icon: require('../../../assets/images/home/categories/food.png') },
  {
    id: 'beauty',
    label: 'Beauty',
    icon: require('../../../assets/images/home/categories/beauty.png'),
  },
  {
    id: 'health',
    label: 'Health',
    icon: require('../../../assets/images/home/categories/health.png'),
  },
  { id: 'fun', label: 'Fun', icon: require('../../../assets/images/home/categories/fun.png') },
];

export const homeBalance: BalanceSummary = {
  cashBack: 124,
  cashBackDelta: 20,
  cashOut: 24,
};

export const homeSections: ProductSection[] = [
  {
    id: 'persian-food',
    title: 'Persian Food',
    products: [
      {
        id: 'pf-1',
        title: "Khaghan's Royal Breakfast",
        image: productImages.p1,
        rating: 4.3,
        count: 2231,
        countUnit: 'orders',
        cashBackPercent: 20,
        cashOutPercent: 10,
      },
      {
        id: 'pf-2',
        title: 'Self-serve breakfast buffet with live music.',
        image: productImages.p2,
        rating: 4.0,
        count: 1341,
        countUnit: 'orders',
        cashBackPercent: 40,
        cashOutPercent: 10,
      },
    ],
  },
  {
    id: 'hot-offers',
    title: 'Hot Offers',
    promoted: true,
    moreLabel: 'See 12 more',
    products: [
      {
        id: 'ho-1',
        title: 'Sara Beauty Lounge',
        image: productImages.p3,
        rating: 3.9,
        count: 2231,
        countUnit: 'visit',
        cashBackPercent: 40,
        cashOutPercent: 10,
      },
      {
        id: 'ho-2',
        title: 'Teeth Whitening',
        image: productImages.p4,
        rating: 4.0,
        count: 1341,
        countUnit: 'visit',
        cashBackPercent: 20,
        cashOutPercent: 10,
      },
    ],
  },
  {
    id: 'beauty',
    title: 'Beauty',
    products: [
      {
        id: 'be-1',
        title: 'Sara Beauty Lounge',
        image: productImages.p3,
        rating: 3.9,
        count: 2231,
        countUnit: 'visit',
        cashBackPercent: 40,
        cashOutPercent: 10,
      },
      {
        id: 'be-2',
        title: 'Teeth Whitening',
        image: productImages.p4,
        rating: 4.0,
        count: 1341,
        countUnit: 'visit',
        cashBackPercent: 20,
        cashOutPercent: 20,
      },
    ],
  },
  {
    id: 'health',
    title: 'Health',
    products: [
      {
        id: 'he-1',
        title: 'Golzar Tala Florist',
        image: productImages.p5,
        rating: 3.9,
        count: 2231,
        countUnit: 'visit',
        cashBackPercent: 20,
        cashOutPercent: 10,
      },
      {
        id: 'he-2',
        title: 'Teeth Whitening',
        image: productImages.p4,
        rating: 4.0,
        count: 1341,
        countUnit: 'visit',
        cashBackPercent: 20,
        cashOutPercent: 20,
      },
    ],
  },
  {
    id: 'fun',
    title: 'Fun',
    products: [
      {
        id: 'fu-1',
        title: 'Mench Café - Where Childhood Lives On',
        image: productImages.p6,
        rating: 3.9,
        count: 2231,
        countUnit: 'visit',
        cashBackPercent: 20,
        cashOutPercent: 10,
      },
      {
        id: 'fu-2',
        title: 'The Aroma of Coffee, a Bustling City',
        image: productImages.p7,
        rating: 4.0,
        count: 1341,
        countUnit: 'visit',
        cashBackPercent: 20,
        cashOutPercent: 20,
      },
    ],
  },
];
