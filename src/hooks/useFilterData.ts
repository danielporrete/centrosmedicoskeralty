import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function fetchAllRows(
  table: "malla_formacion",
  select: string,
  filters?: (q: any) => any,
  batchSize = 1000
): Promise<any[]> {
  const all: any[] = [];
  let offset = 0;
  let hasMore = true;
  while (hasMore) {
    let q = supabase.from(table).select(select).range(offset, offset + batchSize - 1);
    if (filters) q = filters(q);
    const { data, error } = await q;
    if (error) throw error;
    if (data && data.length > 0) {
      all.push(...data);
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
      const data = await fetchAllRows(
        "malla_formacion",
        "cargo",
        (q: any) => q.not("cargo", "is", null).order("cargo")
      );
      const unique = [...new Set(data.map((d) => d.cargo))].filter(Boolean);
      return unique.map((name) => ({ value: name!, label: name! }));
    },
  });

export const useLineasByCargo = (cargo?: string) =>
  useQuery({
    queryKey: ["lineas-by-cargo", cargo],
    queryFn: async () => {
      const data = await fetchAllRows(
        "malla_formacion",
        "linea",
        (q: any) => q.eq("cargo", cargo).not("linea", "is", null).order("linea")
      );
      const unique = [...new Set(data.map((d) => d.linea))].filter(
        (v) => Boolean(v) && v !== "Temas específicos centros médicos"
      );
      return unique.map((name) => ({ value: name!, label: name! }));
    },
    enabled: !!cargo,
  });

export const useServiciosByLinea = (linea?: string) =>
  useQuery({
    queryKey: ["servicios-by-linea", linea],
    queryFn: async () => {
      const data = await fetchAllRows(
        "sedes_servicios_colores" as any,
        "servicio",
        (q: any) => q.eq("linea", linea).not("servicio", "is", null).order("servicio")
      );
      const unique = [...new Set(data.map((d: any) => d.servicio))].filter(Boolean);
      return unique.map((name) => ({ value: name!, label: name! }));
    },
    enabled: !!linea,
  });

export const useCursosByCargo = (cargo?: string, linea?: string) =>
  useQuery({
    queryKey: ["cursos-malla", cargo, linea],
    queryFn: async () => {
      const data = await fetchAllRows(
        "malla_formacion",
        "*",
        (q: any) => {
          let query = q.order("esencial");
          if (cargo) query = query.eq("cargo", cargo);
          if (linea) query = query.eq("linea", linea);
          return query;
        }
      );
      return data;
    },
    enabled: !!cargo,
  });
