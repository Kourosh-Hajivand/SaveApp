// src/utils/openMaps.ts
import { Linking, Platform } from "react-native";

export type LatLng = { latitude: number; longitude: number };

export async function openMapsByLatLng(opts: {
   coords: LatLng;
   title?: string;
}) {
   const { latitude, longitude } = opts.coords;
   const title = encodeURIComponent(opts.title ?? "Location");

   const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${title}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${title})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
   })!;

   const supported = await Linking.canOpenURL(url);
   if (supported) return Linking.openURL(url);

   // fallback
   return Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
   );
}
