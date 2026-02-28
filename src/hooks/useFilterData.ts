import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function fetchAllRows<T>(
  table: string,
  select: string,
  filters?: (q: any) => any,
  batchSize = 1000
): Promise<T[]> {
  const all: T[] = [];
  let offset = 0;
  let hasMore = true;
  while (hasMore) {
    let q = supabase.from(table).select(select).range(offset, offset + batchSize - 1);
    if (filters) q = filters(q);
    const { data, error } = await q;
    if (error) throw error;
    if (data && data.length > 0) {
      all.push(...(data as T[]));
      offset += batchSize;
      hasMore = data.length === batchSize;
    } else {
      hasMore = false;
    }
  }
  return all;
}

export const useCargos = () =>
  useQuery({
    queryKey: ["cargos"],
    queryFn: async () => {
      const data = await fetchAllRows<{ cargo: string }>(
        "malla_formacion",
        "cargo",
        (q: any) => q.not("cargo", "is", null).order("cargo")
      );
      const unique = [...new Set(data.map((d) => d.cargo))].filter(Boolean);
      return unique.map((name) => ({ value: name!, label: name! }));
    },
  });

export const useCursosByCargo = (cargo?: string) =>
  useQuery({
    queryKey: ["cursos-malla", cargo],
    queryFn: async () => {
      const data = await fetchAllRows(
        "malla_formacion",
        "*",
        (q: any) => {
          let query = q.order("esencial");
          if (cargo) query = query.eq("cargo", cargo);
          return query;
        }
      );
      return data;
    },
    enabled: !!cargo,
  });
