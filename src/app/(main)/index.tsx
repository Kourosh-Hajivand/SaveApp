import { BottomNavBar, type BottomTabKey } from "@/components/navigation/BottomNavBar";
import { colors } from "@/constants/colors";
import {
  BalanceCard,
  CategoryList,
  HomeHeader,
  ProductSection,
  homeBalance,
  homeCategories,
  homeSections,
  type Product,
} from "@/features/home";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOTTOM_NAV_SPACE = 130;

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState<string>(homeCategories[0].id);
  const [activeTab, setActiveTab] = useState<BottomTabKey>("inbox");

  const handleSelectCategory = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
  }, []);

  const handleProductPress = useCallback(
    (product: Product) => {
      router.push({
        pathname: "/(main)/product/[id]",
        params: { id: product.id, promoted: product.cashBackPercent >= 40 ? "1" : "0" },
      });
    },
    [router],
  );

  const handleTabPress = useCallback(
    (key: BottomTabKey) => {
      if (key === "profile") {
        router.push("/(auth)/auth");
        return;
      }
      setActiveTab(key);
    },
    [router],
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerArea}>
        <HomeHeader />
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topContent}>
          <View style={styles.balanceWrap}>
            <BalanceCard balance={homeBalance} />
          </View>
          <CategoryList
            categories={homeCategories}
            activeCategoryId={activeCategoryId}
            onSelect={handleSelectCategory}
          />
        </View>

        {homeSections.map((section) => (
          <ProductSection
            key={section.id}
            section={section}
            onProductPress={handleProductPress}
          />
        ))}
      </ScrollView>

      <BottomNavBar activeKey={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerArea: {
    backgroundColor: colors.white,
    zIndex: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BOTTOM_NAV_SPACE,
  },
  topContent: {
    paddingVertical: 16,
    gap: 21,
  },
  balanceWrap: {
    paddingHorizontal: 20,
  },
});
