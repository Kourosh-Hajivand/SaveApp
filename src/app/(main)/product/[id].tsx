import { colors } from '@/constants/colors';
import type { Product } from '@/features/home';
import { ProductDetailScreen, getProductDetail } from '@/features/product';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Share } from 'react-native';

export default function ProductDetailRoute() {
  const router = useRouter();
  const { id, promoted } = useLocalSearchParams<{ id?: string; promoted?: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  const detail = useMemo(() => getProductDetail(id, promoted === '1'), [id, promoted]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(main)');
  }, [router]);

  const handleToggleFavorite = useCallback(() => {
    setIsFavorite((value) => !value);
  }, []);

  const handleShare = useCallback(() => {
    Share.share({ message: detail.title }).catch(() => {
      // Sharing dismissed or unavailable — no action needed.
    });
  }, [detail.title]);

  const handleProductPress = useCallback(
    (product: Product) => {
      router.push({
        pathname: '/(main)/product/[id]',
        params: { id: product.id, promoted: product.cashBackPercent >= 40 ? '1' : '0' },
      });
    },
    [router],
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />

      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon="chevron.left"
          tintColor={colors.blackText}
          accessibilityLabel="Go back"
          onPress={handleBack}
        />
      </Stack.Toolbar>

      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          tintColor={colors.blackText}
          accessibilityLabel="Share"
          onPress={handleShare}
        />
        <Stack.Toolbar.Button
          icon={isFavorite ? 'heart.fill' : 'heart'}
          tintColor={isFavorite ? colors.mohajerRed : colors.blackText}
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onPress={handleToggleFavorite}
        />
      </Stack.Toolbar>

      <ProductDetailScreen detail={detail} onProductPress={handleProductPress} />
    </>
  );
}
