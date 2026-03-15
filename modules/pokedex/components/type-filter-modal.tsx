import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { memo, useCallback } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  ALL_GENERATIONS,
  ALL_TYPES,
  GENERATIONS,
  TYPE_COLORS,
} from "../constants";
import type { PokemonGeneration, PokemonType } from "../types";

type Props = {
  visible: boolean;
  selectedTypes: PokemonType[];
  selectedGenerations: PokemonGeneration[];
  onToggleType: (type: PokemonType) => void;
  onToggleGeneration: (gen: PokemonGeneration) => void;
  onClearTypes: () => void;
  onClearGenerations: () => void;
  onClose: () => void;
};

type TypeChipProps = {
  type: PokemonType;
  selected: boolean;
  onPress: (t: PokemonType) => void;
};

function TypeChip({ type, selected, onPress }: TypeChipProps) {
  const color = TYPE_COLORS[type];
  const handlePress = useCallback(() => onPress(type), [onPress, type]);
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color : color + "22",
          borderColor: selected ? color : color + "55",
        },
      ]}
    >
      <ThemedText
        style={[styles.chipText, { color: selected ? "#fff" : color }]}
      >
        {type}
      </ThemedText>
    </Pressable>
  );
}

type GenChipProps = {
  gen: PokemonGeneration;
  selected: boolean;
  onPress: (g: PokemonGeneration) => void;
};

function GenChip({ gen, selected, onPress }: GenChipProps) {
  const handlePress = useCallback(() => onPress(gen), [onPress, gen]);
  return (
    <Pressable
      onPress={handlePress}
      style={[styles.chip, styles.genChip, selected && styles.genChipSelected]}
    >
      <ThemedText
        style={[
          styles.chipText,
          styles.genChipText,
          selected && styles.genChipTextSelected,
        ]}
      >
        {GENERATIONS[gen].label}
      </ThemedText>
    </Pressable>
  );
}

const TypeChipMemo = memo(TypeChip);
const GenChipMemo = memo(GenChip);

function TypeFilterModal({
  visible,
  selectedTypes,
  selectedGenerations,
  onToggleType,
  onToggleGeneration,
  onClearTypes,
  onClearGenerations,
  onClose,
}: Props) {
  const bgColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");

  const totalActive = selectedTypes.length + selectedGenerations.length;

  const handleClearAll = useCallback(() => {
    onClearTypes();
    onClearGenerations();
  }, [onClearTypes, onClearGenerations]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <ThemedView style={[styles.sheet, { backgroundColor: bgColor }]}>
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: iconColor + "33" }]} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <View>
            <ThemedText style={styles.sheetTitle}>Filters</ThemedText>
            {totalActive > 0 && (
              <ThemedText style={[styles.activeCount, { color: iconColor }]}>
                {totalActive} active
              </ThemedText>
            )}
          </View>
          <Pressable onPress={handleClearAll} style={styles.clearAllBtn}>
            <ThemedText style={[styles.clearAllText, { color: iconColor }]}>
              Clear all
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Generation */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                Generation
              </ThemedText>
              {selectedGenerations.length > 0 && (
                <Pressable onPress={onClearGenerations}>
                  <ThemedText style={[styles.clearText, { color: iconColor }]}>
                    Clear
                  </ThemedText>
                </Pressable>
              )}
            </View>
            <View style={styles.chipsWrapper}>
              {ALL_GENERATIONS.map((gen) => (
                <GenChipMemo
                  key={gen}
                  gen={gen}
                  selected={selectedGenerations.includes(gen)}
                  onPress={onToggleGeneration}
                />
              ))}
            </View>
          </View>

          {/* Type */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                Type
              </ThemedText>
              {selectedTypes.length > 0 && (
                <Pressable onPress={onClearTypes}>
                  <ThemedText style={[styles.clearText, { color: iconColor }]}>
                    Clear
                  </ThemedText>
                </Pressable>
              )}
            </View>
            <View style={styles.chipsWrapper}>
              {ALL_TYPES.map((type) => (
                <TypeChipMemo
                  key={type}
                  type={type}
                  selected={selectedTypes.includes(type)}
                  onPress={onToggleType}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Done button */}
        <Pressable style={styles.doneBtn} onPress={onClose}>
          <ThemedText style={styles.doneBtnText}>
            {totalActive > 0 ? `Show results` : "Done"}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </Modal>
  );
}

export default memo(TypeFilterModal);

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "#00000060" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 14,
    maxHeight: "82%",
    gap: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 2,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sheetTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  activeCount: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  clearAllBtn: { paddingHorizontal: 4, paddingVertical: 2, marginTop: 4 },
  clearAllText: { fontSize: 13, fontWeight: "600" },
  scrollContent: { gap: 4, paddingBottom: 8 },
  section: { gap: 10, marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.5,
  },
  clearText: { fontSize: 12, fontWeight: "600" },
  chipsWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  genChip: { backgroundColor: "#88888815", borderColor: "#88888840" },
  genChipSelected: { backgroundColor: "#3B4CCA", borderColor: "#3B4CCA" },
  genChipText: { color: "#888" },
  genChipTextSelected: { color: "#fff" },
  doneBtn: {
    backgroundColor: "#E63946",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
