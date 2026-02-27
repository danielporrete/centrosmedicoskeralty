import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCategories, useLevels, useAreas } from "@/hooks/useFilterData";
import { Search, SlidersHorizontal } from "lucide-react";

const Index = () => {
  const [categoryId, setCategoryId] = useState<string>("");
  const [levelId, setLevelId] = useState<string>("");
  const [areaId, setAreaId] = useState<string>("");

  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: levels, isLoading: loadingLevels } = useLevels();
  const { data: areas, isLoading: loadingAreas } = useAreas();
  const navigate = useNavigate();

  const hasFilters = categoryId || levelId || areaId;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    if (levelId) params.set("level", levelId);
    if (areaId) params.set("area", areaId);
    navigate(`/resultados?${params.toString()}`);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
              <SlidersHorizontal className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Encuentra los cursos ideales
            </h2>
            <p className="text-muted-foreground text-lg">
              Selecciona los filtros para caracterizar el contenido que necesitas asignar.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border p-8 space-y-6 shadow-sm">
            <FilterSelect
              label="Categoría"
              placeholder="Selecciona una categoría"
              value={categoryId}
              onChange={setCategoryId}
              options={categories?.map((c) => ({ value: c.id, label: c.name })) ?? []}
              loading={loadingCats}
            />
            <FilterSelect
              label="Nivel"
              placeholder="Selecciona un nivel"
              value={levelId}
              onChange={setLevelId}
              options={levels?.map((l) => ({ value: l.id, label: l.name })) ?? []}
              loading={loadingLevels}
            />
            <FilterSelect
              label="Área"
              placeholder="Selecciona un área"
              value={areaId}
              onChange={setAreaId}
              options={areas?.map((a) => ({ value: a.id, label: a.name })) ?? []}
              loading={loadingAreas}
            />

            <Button
              onClick={handleSearch}
              disabled={!hasFilters}
              className="w-full h-12 text-base font-semibold gap-2"
              size="lg"
            >
              <Search className="w-5 h-5" />
              Buscar Cursos
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

function FilterSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  loading,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  loading: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 text-base">
          <SelectValue placeholder={loading ? "Cargando..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default Index;
