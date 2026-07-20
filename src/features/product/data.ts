import type { Product } from '@/features/home';
import { homeSections } from '@/features/home';
import type { ProductDetail } from './types';

/**
 * Static demo content for the product detail screen. In production these
 * values come from the API via a service + React Query hook; the shapes match
 * `types.ts` so the UI does not change when the data source is swapped.
 */

const heroImage = require('../../../assets/images/product/hero.png');
const hostAvatar = require('../../../assets/images/product/host.png');

const allProducts: Product[] = homeSections.flatMap((section) => section.products);

const OPENING_HOURS = [
  { label: 'Mon - Thu', time: '11:00 AM - 9:00 PM' },
  { label: 'Fri - Sat', time: '11:00 AM - 11:00 PM' },
  { label: 'Sunday', time: '10:00 AM - 8:00 PM' },
];

const STORY =
  "Khaghan Breakfast offers an authentic Iranian-style morning experience, filled with rich flavors, fresh ingredients, and traditional comfort. Guests can enjoy a variety of classic Persian breakfast staples such as freshly baked bread (sangak, barbari, or lavash), creamy feta cheese, walnuts, cucumbers, tomatoes, and fresh herbs. Warm dishes like halim, lentil soup, or fried eggs with sujuk/sausages complement the spread, while sweet options such as honey, jam, and clotted cream with fresh bread add balance.\n\nThe meal is accompanied by Persian black tea served in traditional glass cups, creating a homely and cultural atmosphere. It’s more than just breakfast—it’s a social and family-style gathering that captures the essence of Iranian hospitality.";

/**
 * Builds a product detail from the demo catalog. Falls back to the first
 * product when the id is unknown so the screen always has content to render.
 */
export function getProductDetail(id?: string, promoted?: boolean): ProductDetail {
  const base = allProducts.find((product) => product.id === id) ?? allProducts[0];
  const otherOptions = allProducts.filter((product) => product.id !== base.id).slice(0, 4);

  return {
    id: base.id,
    title: base.title,
    images: [heroImage, base.image],
    rating: base.rating,
    count: base.count,
    countUnit: base.countUnit,
    host: {
      name: "Khaghan's Royal Breakfast",
      avatar: hostAvatar,
    },
    cashBackPercent: base.cashBackPercent,
    cashOutPercent: base.cashOutPercent,
    offer: promoted ? { endsInLabel: '4 Days' } : undefined,
    openingHours: OPENING_HOURS,
    story: STORY,
    otherOptions,
  };
}
