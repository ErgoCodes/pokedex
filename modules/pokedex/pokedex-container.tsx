import { ThemedView } from "@/components/themed-view";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PokedexList from "./components/pokedex-list";
import { usePokedex } from "./hooks/use-pokedex";

export default function PokedexContainer() {
  const insets = useSafeAreaInsets();
  const state = usePokedex();

  const handlePressPokemon = useCallback((_id: number) => {
    // navigate to detail — coming soon
  }, []);

  return (
    <ThemedView style={styles.container}>
      <PokedexList
        {...state}
        onPressPokemon={handlePressPokemon}
        bottomInset={insets.bottom}
        topInset={insets.top}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
