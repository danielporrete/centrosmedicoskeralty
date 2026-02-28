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
      // Get unique values
      const unique = [...new Set(data.map((d) => d.agrupacion))].filter(Boolean);
      return unique.map((name) => ({ value: name!, label: name! }));
    },
  });

export const useLevels = () =>
  useQuery({
    queryKey: ["levels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("levels").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

export const useAreas = () =>
  useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("areas").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

export const useCourses = (filters: {
  categoryId?: string;
  levelId?: string;
  areaId?: string;
}) =>
  useQuery({
    queryKey: ["courses", filters],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select("*, categories(name), levels(name), areas(name)")
        .order("title");

      if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
      if (filters.levelId) query = query.eq("level_id", filters.levelId);
      if (filters.areaId) query = query.eq("area_id", filters.areaId);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!(filters.categoryId || filters.levelId || filters.areaId),
  });
