import { ThemedText } from "@/components/themed-text";
import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ALL_TYPES, TYPE_COLORS } from "../constants";
import type { PokemonType } from "../types";

type Props = {
  selected: PokemonType | null;
  onSelect: (type: PokemonType | null) => void;
};

function TypeChip({
  type,
  selected,
  onPress,
}: {
  type: PokemonType;
  selected: boolean;
  onPress: (t: PokemonType) => void;
}) {
  const color = TYPE_COLORS[type];
  return (
    <Pressable
      onPress={() => onPress(type)}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color : color + "33",
          borderColor: color,
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

const TypeChipMemo = memo(TypeChip);

function TypeFilter({ selected, onSelect }: Props) {
  const handlePress = useCallback(
    (type: PokemonType) => onSelect(selected === type ? null : type),
    [selected, onSelect],
  );
  return (
    <View style={styles.wrapper}>
      {ALL_TYPES.map((type) => (
        <TypeChipMemo
          key={type}
          type={type}
          selected={selected === type}
          onPress={handlePress}
        />
      ))}
    </View>
  );
}

export default memo(TypeFilter);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
});
