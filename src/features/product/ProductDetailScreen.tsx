import StarIcon from "@/assets/icons/StarIcon";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import type { Product } from "@/features/home";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CashbackSummary } from "./components/CashbackSummary";
import { HostedByCard } from "./components/HostedByCard";
import { OpeningHours } from "./components/OpeningHours";
import { OtherOptions } from "./components/OtherOptions";
import { OurStory } from "./components/OurStory";
import { ProductHero } from "./components/ProductHero";
import type { ProductDetail } from "./types";

interface ProductDetailScreenProps {
  detail: ProductDetail;
  onHostPress?: () => void;
  onProductPress?: (product: Product) => void;
}

function formatCount(count: number, unit: ProductDetail["countUnit"]): string {
  return `(${count.toLocaleString("en-US")} ${unit})`;
}

export function ProductDetailScreen({ detail, onHostPress, onProductPress }: ProductDetailScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }} bounces={false} overScrollMode="never">
        <ProductHero images={detail.images} />

        <View style={styles.sheet}>
          <View style={styles.headerBlock}>
            <Text style={styles.title}>{detail.title}</Text>
            <View style={styles.ratingRow}>
              <StarIcon size={13} color="#545454" />
              <Text style={styles.meta}>{detail.rating.toFixed(1)}</Text>
              <Text style={styles.meta}>{formatCount(detail.count, detail.countUnit)}</Text>
            </View>
          </View>

          <HostedByCard name={detail.host.name} avatar={detail.host.avatar} onPress={onHostPress} />

          <CashbackSummary cashBackPercent={detail.cashBackPercent} cashOutPercent={detail.cashOutPercent} offer={detail.offer} />

          <OpeningHours hours={detail.openingHours} />

          <View style={styles.divider} />

          <OurStory story={detail.story} />

          <View style={styles.dividerWrap}>
            <View style={styles.divider} />
          </View>

          <View style={styles.spacer} />

          <OtherOptions products={detail.otherOptions} onProductPress={onProductPress} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sheet: {
    marginTop: -24,
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  headerBlock: {
    width: "100%",
    gap: 8,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 20,
    lineHeight: 28,
    color: colors.blackText,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.slate500,
  },
  divider: {
    width: "100%",
    height: 4,
    backgroundColor: colors.bgColor,
  },
  dividerWrap: {
    width: "100%",
    paddingTop: 16,
  },
  spacer: {
    height: 20,
  },
});
