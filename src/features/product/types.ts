import type { ImageSourcePropType } from 'react-native';
import type { Product, ProductCountUnit } from '@/features/home';

export interface OpeningHour {
  /** Day range label, e.g. "Mon - Thu". */
  label: string;
  /** Human-readable time range, e.g. "11:00 AM - 9:00 PM". */
  time: string;
}

export interface ProductHost {
  name: string;
  avatar: ImageSourcePropType;
}

/** Time-limited promotion shown as a highlighted cash-back offer. */
export interface CashbackOffer {
  /** Countdown label, e.g. "4 Days". */
  endsInLabel: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  /** Hero gallery images (swipeable). */
  images: ImageSourcePropType[];
  rating: number;
  count: number;
  countUnit: ProductCountUnit;
  host: ProductHost;
  cashBackPercent: number;
  cashOutPercent: number;
  /** When present, the cash-back half is emphasised and an offer banner shows. */
  offer?: CashbackOffer;
  openingHours: OpeningHour[];
  story: string;
  /** Related products rendered in the "Other Options" carousel. */
  otherOptions: Product[];
}
