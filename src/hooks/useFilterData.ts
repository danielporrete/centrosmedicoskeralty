import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCargos = () =>
  useQuery({
    queryKey: ["cargos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("malla_formacion")
        .select("cargo")
        .not("cargo", "is", null)
        .order("cargo");
      if (error) throw error;
      const unique = [...new Set(data.map((d) => d.cargo))].filter(Boolean);
      return unique.map((name) => ({ value: name!, label: name! }));
    },
  });

export const useCursosByCargo = (cargo?: string) =>
  useQuery({
    queryKey: ["cursos-malla", cargo],
    queryFn: async () => {
      let query = supabase
        .from("malla_formacion")
        .select("*")
        .order("esencial");

      if (cargo) query = query.eq("cargo", cargo);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!cargo,
  });
