import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function fetchAllRows(
  table: "malla_formacion" | "malla_fundamental" | "sedes_servicios_colores" | "malla_diferenciales",
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

export const useFundamentalesByCargo = (cargo?: string, linea?: string) =>
  useQuery({
    queryKey: ["fundamentales", cargo, linea],
    queryFn: async () => {
      const data = await fetchAllRows(
        "malla_fundamental",
        "id,fundamental,objetivo_aprendizaje,cargo,linea",
        (q: any) => {
          let query = q.order("fundamental");
          if (cargo) query = query.eq("cargo", cargo);
          if (linea) query = query.eq("linea", linea);
          return query;
        }
      );
      return data;
    },
    enabled: !!cargo,
  });

export const useHerramientaTecnologica = (cargo?: string, linea?: string) =>
  useQuery({
    queryKey: ["herramienta-tecnologica", cargo, linea],
    queryFn: async () => {
      const data = await fetchAllRows(
        "malla_formacion",
        "herramienta_tecnologica",
        (q: any) => {
          let query = q.not("herramienta_tecnologica", "is", null);
          if (cargo) query = query.eq("cargo", cargo);
          if (linea) query = query.eq("linea", linea);
          return query;
        }
      );
      // Count occurrences and return most common
      const counts: Record<string, number> = {};
      data.forEach((d: any) => {
        if (d.herramienta_tecnologica) {
          counts[d.herramienta_tecnologica] = (counts[d.herramienta_tecnologica] || 0) + 1;
        }
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      return sorted.length > 0 ? sorted[0][0] : null;
    },
    enabled: !!cargo,
  });

export const useDiferencialesByLinea = (linea?: string) =>
  useQuery({
    queryKey: ["diferenciales-linea", linea],
    queryFn: async () => {
      const data = await fetchAllRows(
        "malla_diferenciales",
        "diferencial_linea,objetivo_aprendizaje_linea,linea",
        (q: any) => q.eq("linea", linea).not("diferencial_linea", "is", null)
      );
      const counts: Record<string, { count: number; objetivo: string | null }> = {};
      data.forEach((d: any) => {
        if (d.diferencial_linea) {
          if (!counts[d.diferencial_linea]) {
            counts[d.diferencial_linea] = { count: 0, objetivo: d.objetivo_aprendizaje_linea };
          }
          counts[d.diferencial_linea].count++;
        }
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1].count - a[1].count);
      if (sorted.length > 0) {
        return { titulo: sorted[0][0], objetivo: sorted[0][1].objetivo };
      }
      return null;
    },
    enabled: !!linea,
  });

export const useDiferencialesByServicio = (servicio?: string) =>
  useQuery({
    queryKey: ["diferenciales-servicio", servicio],
    queryFn: async () => {
      const data = await fetchAllRows(
        "malla_diferenciales",
        "diferencial_servicio,objetivo_aprendizaje_servicio,servicio",
        (q: any) => q.eq("servicio", servicio).not("diferencial_servicio", "is", null)
      );
      if (data.length > 0) {
        return { titulo: data[0].diferencial_servicio, objetivo: data[0].objetivo_aprendizaje_servicio };
      }
      return null;
    },
    enabled: !!servicio,
  });
