import type { ImageSourcePropType } from 'react-native';

/** How a product's engagement count should be labelled ("orders", "visit", ...). */
export type ProductCountUnit = 'orders' | 'visit';

export interface Product {
  id: string;
  title: string;
  image: ImageSourcePropType;
  rating: number;
  /** Raw count shown next to the rating, e.g. 2231 -> "(2,231 orders)". */
  count: number;
  countUnit: ProductCountUnit;
  /** Cash back percentage (0-100). */
  cashBackPercent: number;
  /** Cash out percentage (0-100). */
  cashOutPercent: number;
}

export interface ProductSection {
  id: string;
  title: string;
  products: Product[];
  /**
   * Renders the promoted ("Hot Offers") variant: highlighted background,
   * flame icon, a "See more" affordance and emphasised cash-back chips.
   */
  promoted?: boolean;
  /** Optional label shown next to the section arrow, e.g. "See 12 more". */
  moreLabel?: string;
}

export interface Category {
  id: string;
  label: string;
  icon: ImageSourcePropType;
}

export interface BalanceSummary {
  cashBack: number;
  /** Recent cash-back gain shown as "+20$". */
  cashBackDelta: number;
  cashOut: number;
}
