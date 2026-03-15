import type { GenerationMeta, PokemonGeneration, PokemonType } from "./types";

export const POKEAPI_BASE = "https://pokeapi.co/api/v2";
export const POKEMON_TOTAL = 1025; // Gen I–IX

export const GENERATIONS: Record<PokemonGeneration, GenerationMeta> = {
  1: { label: "Gen I", range: [1, 151] },
  2: { label: "Gen II", range: [152, 251] },
  3: { label: "Gen III", range: [252, 386] },
  4: { label: "Gen IV", range: [387, 493] },
  5: { label: "Gen V", range: [494, 649] },
  6: { label: "Gen VI", range: [650, 721] },
  7: { label: "Gen VII", range: [722, 809] },
  8: { label: "Gen VIII", range: [810, 905] },
  9: { label: "Gen IX", range: [906, 1025] },
};

export const ALL_GENERATIONS = Object.keys(GENERATIONS).map(
  Number,
) as PokemonGeneration[];

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export const ALL_TYPES = Object.keys(TYPE_COLORS) as PokemonType[];
