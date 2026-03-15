import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { FlashList } from "@shopify/flash-list";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import type { PokemonGeneration, PokemonListItem, PokemonType } from "../types";
import PokemonCard from "./pokemon-card";
import TypeFilterModal from "./type-filter-modal";

export type PokedexListProps = {
  pokemon: PokemonListItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTypes: PokemonType[];
  selectedGenerations: PokemonGeneration[];
  onSearch: (q: string) => void;
  onToggleType: (t: PokemonType) => void;
  onClearTypes: () => void;
  onToggleGeneration: (g: PokemonGeneration) => void;
  onClearGenerations: () => void;
  onPressPokemon: (id: number) => void;
  bottomInset: number;
  topInset: number;
};

function ListEmpty() {
  return (
    <ThemedView style={styles.center}>
      <ThemedText style={styles.dimText}>No Pokémon found.</ThemedText>
    </ThemedView>
  );
}

function PokedexList({
  pokemon,
  loading,
  error,
  searchQuery,
  selectedTypes,
  selectedGenerations,
  onSearch,
  onToggleType,
  onClearTypes,
  onToggleGeneration,
  onClearGenerations,
  onPressPokemon,
  bottomInset,
  topInset,
}: PokedexListProps) {
  const [filterVisible, setFilterVisible] = useState(false);
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  const listRef = useRef<FlashList<PokemonListItem>>(null);

  // Scroll to top whenever filters or search change
  useEffect(() => {
    if (pokemon.length > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [searchQuery, selectedTypes, selectedGenerations, pokemon.length]);

  const totalFilters = selectedTypes.length + selectedGenerations.length;
  const hasFilter = totalFilters > 0;

  const openFilter = useCallback(() => setFilterVisible(true), []);
  const closeFilter = useCallback(() => setFilterVisible(false), []);

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <PokemonCard item={item} onPress={onPressPokemon} />
    ),
    [onPressPokemon],
  );

  const keyExtractor = useCallback(
    (item: PokemonListItem) => String(item.id),
    [],
  );

  const headerStyle = useMemo(
    () => [
      styles.header,
      { paddingTop: topInset + 12, backgroundColor: bgColor },
    ],
    [topInset, bgColor],
  );

  const searchBoxStyle = useMemo(
    () => [
      styles.searchBox,
      { backgroundColor: iconColor + "12", borderColor: iconColor + "28" },
    ],
    [iconColor],
  );

  const listContentStyle = useMemo(
    () => ({
      paddingHorizontal: 8,
      paddingTop: 12,
      paddingBottom: bottomInset + 24,
    }),
    [bottomInset],
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={headerStyle}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <ThemedText style={styles.title}>Pokédex</ThemedText>
            <ThemedText style={[styles.subtitle, { color: iconColor }]}>
              {loading
                ? `Loading… ${pokemon.length} so far`
                : `${pokemon.length} Pokémon`}
            </ThemedText>
          </View>
          {loading && <ActivityIndicator size="small" color={iconColor} />}
        </View>

        <View style={styles.controlsRow}>
          <View style={searchBoxStyle}>
            <ThemedText style={[styles.searchIcon, { color: iconColor }]}>
              🔍
            </ThemedText>
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Search Pokémon…"
              placeholderTextColor={iconColor + "99"}
              value={searchQuery}
              onChangeText={onSearch}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          <Pressable
            onPress={openFilter}
            style={[styles.filterBtn, hasFilter && styles.filterBtnActive]}
          >
            {hasFilter ? (
              <View style={styles.filterBtnInner}>
                <ThemedText style={styles.filterBtnText}>Filters</ThemedText>
                <View style={styles.filterBadge}>
                  <ThemedText style={styles.filterBadgeText}>
                    {totalFilters}
                  </ThemedText>
                </View>
              </View>
            ) : (
              <ThemedText style={[styles.filterBtnText, { color: iconColor }]}>
                Filter
              </ThemedText>
            )}
          </Pressable>
        </View>
      </ThemedView>

      {error !== null ? (
        <ThemedView style={styles.center}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </ThemedView>
      ) : (
        <FlashList
          ref={listRef}
          data={pokemon}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          estimatedItemSize={210}
          ListEmptyComponent={loading ? null : ListEmpty}
          contentContainerStyle={listContentStyle}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TypeFilterModal
        visible={filterVisible}
        selectedTypes={selectedTypes}
        selectedGenerations={selectedGenerations}
        onToggleType={onToggleType}
        onToggleGeneration={onToggleGeneration}
        onClearTypes={onClearTypes}
        onClearGenerations={onClearGenerations}
        onClose={closeFilter}
      />
    </ThemedView>
  );
}

export default memo(PokedexList);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#00000018",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleBlock: { gap: 1 },
  title: { fontSize: 34, fontWeight: "800", letterSpacing: -1 },
  subtitle: { fontSize: 12, fontWeight: "500", letterSpacing: 0.1 },
  controlsRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
  },
  searchIcon: { fontSize: 13 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: "400" },
  filterBtn: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#88888844",
    paddingHorizontal: 16,
    paddingVertical: 11,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  filterBtnActive: {
    backgroundColor: "#E63946",
    borderColor: "#E63946",
  },
  filterBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  filterBadge: {
    backgroundColor: "#ffffff33",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 80,
  },
  dimText: { opacity: 0.4, fontSize: 14, fontWeight: "500" },
  errorText: { color: "#e53e3e", textAlign: "center", paddingHorizontal: 24 },
});
