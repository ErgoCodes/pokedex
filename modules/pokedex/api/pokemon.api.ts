import { POKEAPI_BASE, POKEMON_TOTAL } from "../constants";
import type {
  PokeApiListResponse,
  PokeApiPokemon,
  PokemonListItem,
  PokemonType,
} from "../types";

function idFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}

function spriteFromData(data: PokeApiPokemon): string {
  // Prefer official artwork, fall back to default sprite
  return (
    data.sprites.other["official-artwork"].front_default ??
    data.sprites.front_default ??
    ""
  );
}

async function fetchSinglePokemon(id: number): Promise<PokemonListItem> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon ${id}`);
  const data: PokeApiPokemon = await res.json();
  return {
    id: data.id,
    name: data.name,
    types: data.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name as PokemonType),
    spriteUrl: spriteFromData(data),
  };
}

/**
 * Fetches all pokemon IDs then resolves each individually in batches.
 * Calls onBatch progressively so the UI can populate as data arrives.
 */
export async function fetchAllPokemon(
  onBatch: (batch: PokemonListItem[]) => void,
  batchSize = 50,
): Promise<void> {
  const listRes = await fetch(
    `${POKEAPI_BASE}/pokemon?limit=${POKEMON_TOTAL}&offset=0`,
  );
  if (!listRes.ok) throw new Error("Failed to fetch pokemon list");
  const listData: PokeApiListResponse = await listRes.json();
  const ids = listData.results.map((p) => idFromUrl(p.url));

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map(fetchSinglePokemon));
    const resolved = results
      .filter(
        (r): r is PromiseFulfilledResult<PokemonListItem> =>
          r.status === "fulfilled",
      )
      .map((r) => r.value);
    if (resolved.length > 0) onBatch(resolved);
  }
}
