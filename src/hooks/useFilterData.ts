import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAgrupaciones = () =>
  useQuery({
    queryKey: ["agrupaciones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("malla_formacion")
        .select("agrupacion")
        .not("agrupacion", "is", null)
        .order("agrupacion");
      if (error) throw error;
      const unique = [...new Set(data.map((d) => d.agrupacion))].filter(Boolean);
      return unique.map((name) => ({ value: name!, label: name! }));
    },
  });

export const useCursosByAgrupacion = (agrupacion?: string) =>
  useQuery({
    queryKey: ["cursos-malla", agrupacion],
    queryFn: async () => {
      let query = supabase
        .from("malla_formacion")
        .select("*")
        .order("esencial");

      if (agrupacion) query = query.eq("agrupacion", agrupacion);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!agrupacion,
  });
