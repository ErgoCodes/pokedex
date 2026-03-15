import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import React, { memo, useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { TYPE_COLORS } from "../constants";
import type { PokemonListItem, PokemonType } from "../types";

const DEFAULT_ACCENT = "#8888881A";

type Props = {
  item: PokemonListItem;
  onPress: (id: number) => void;
};

type TypeBadgeProps = { type: PokemonType };

function TypeBadge({ type }: TypeBadgeProps) {
  const color = TYPE_COLORS[type];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + "28", borderColor: color + "66" },
      ]}
    >
      <ThemedText style={[styles.badgeText, { color }]}>{type}</ThemedText>
    </View>
  );
}

const TypeBadgeMemo = memo(TypeBadge);

type SpriteImageProps = { uri: string; id: number };

function SpriteImage({ uri, id }: SpriteImageProps) {
  const [loading, setLoading] = useState(true);
  const onLoadStart = useCallback(() => setLoading(true), []);
  const onLoadEnd = useCallback(() => setLoading(false), []);

  return (
    <View style={styles.spriteContainer}>
      <Image
        source={{ uri }}
        style={styles.sprite}
        contentFit="contain"
        transition={300}
        recyclingKey={String(id)}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
      />
      {loading && (
        <View style={styles.spinnerOverlay}>
          <ActivityIndicator size="small" color="#ffffff88" />
        </View>
      )}
    </View>
  );
}

const SpriteImageMemo = memo(SpriteImage);

function PokemonCard({ item, onPress }: Props) {
  const { id, name, types, spriteUrl } = item;

  const primaryColor = types.length > 0 ? TYPE_COLORS[types[0]] : undefined;
  const accentBg = primaryColor ? primaryColor + "28" : DEFAULT_ACCENT;

  const handlePress = useCallback(() => onPress(id), [onPress, id]);

  return (
    <Pressable
      style={styles.pressable}
      onPress={handlePress}
      android_ripple={{
        color: primaryColor ? primaryColor + "44" : "#88888844",
      }}
    >
      <ThemedView style={styles.card}>
        {/* Accent area */}
        <View style={[styles.accent, { backgroundColor: accentBg }]}>
          <View style={styles.numberRow}>
            <View
              style={[
                styles.numberPill,
                {
                  backgroundColor: primaryColor
                    ? primaryColor + "33"
                    : "#88888822",
                },
              ]}
            >
              <ThemedText
                style={[styles.number, { color: primaryColor ?? "#999" }]}
              >
                #{String(id).padStart(4, "0")}
              </ThemedText>
            </View>
          </View>
          <SpriteImageMemo uri={spriteUrl} id={id} />
        </View>

        {/* Info area */}
        <ThemedView style={styles.info}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {name}
          </ThemedText>
          {types.length > 0 && (
            <View style={styles.types}>
              {types.map((t) => (
                <TypeBadgeMemo key={t} type={t} />
              ))}
            </View>
          )}
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

export default memo(PokemonCard);

const styles = StyleSheet.create({
  pressable: { flex: 1, margin: 6 },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  accent: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  numberRow: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  numberPill: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  number: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  spriteContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  sprite: { width: 100, height: 100 },
  spinnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 12,
  },
  info: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 6,
    alignItems: "center",
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  types: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
    letterSpacing: 0.3,
  },
});
