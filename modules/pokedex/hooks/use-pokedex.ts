import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchAllPokemon } from "../api/pokemon.api";
import { GENERATIONS } from "../constants";
import type { PokemonGeneration, PokemonListItem, PokemonType } from "../types";

export type PokedexState = {
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
};

export function usePokedex(): PokedexState {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<
    PokemonGeneration[]
  >([]);

  // Accumulate batches without stale closures
  const accumulatorRef = useRef<PokemonListItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    accumulatorRef.current = [];
    setAllPokemon([]);
    setLoading(true);
    setError(null);

    fetchAllPokemon((batch) => {
      if (cancelled) return;
      accumulatorRef.current = [...accumulatorRef.current, ...batch];
      // Keep list sorted by id as batches arrive out of order
      setAllPokemon([...accumulatorRef.current].sort((a, b) => a.id - b.id));
    })
      .catch(() => {
        if (!cancelled)
          setError("Failed to load Pokémon. Check your connection.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const onSearch = useCallback((q: string) => setSearchQuery(q), []);

  const onToggleType = useCallback(
    (t: PokemonType) =>
      setSelectedTypes((prev) =>
        prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
      ),
    [],
  );

  const onClearTypes = useCallback(() => setSelectedTypes([]), []);

  const onToggleGeneration = useCallback(
    (g: PokemonGeneration) =>
      setSelectedGenerations((prev) =>
        prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
      ),
    [],
  );

  const onClearGenerations = useCallback(() => setSelectedGenerations([]), []);

  const pokemon = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return allPokemon.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query)) return false;

      if (selectedGenerations.length > 0) {
        const inGen = selectedGenerations.some((g) => {
          const [min, max] = GENERATIONS[g].range;
          return p.id >= min && p.id <= max;
        });
        if (!inGen) return false;
      }

      if (selectedTypes.length > 0) {
        if (!selectedTypes.every((t) => p.types.includes(t))) return false;
      }

      return true;
    });
  }, [allPokemon, searchQuery, selectedGenerations, selectedTypes]);

  return {
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
  };
}
