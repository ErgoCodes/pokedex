export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type PokemonGeneration = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type GenerationMeta = {
  label: string;
  range: [number, number]; // inclusive id range
};

export type PokemonListItem = {
  id: number;
  name: string;
  types: PokemonType[];
  spriteUrl: string;
};

// PokeAPI response shapes
export type PokeApiListResponse = {
  count: number;
  next: string | null;
  results: { name: string; url: string }[];
};

export type PokeApiPokemon = {
  id: number;
  name: string;
  types: { slot: number; type: { name: string; url: string } }[];
  sprites: {
    front_default: string | null;
    other: { "official-artwork": { front_default: string | null } };
  };
};
