import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCargos } from "@/hooks/useFilterData";
import { Search, SlidersHorizontal } from "lucide-react";

const Index = () => {
  const [cargo, setCargo] = useState<string>("");
  const { data: cargos, isLoading } = useCargos();
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (cargo) params.set("cargo", cargo);
    navigate(`/resultados?${params.toString()}`);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-xl space-y-8">
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

          <div className="bg-card rounded-2xl border border-border p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cargo</label>
              <Select value={cargo} onValueChange={setCargo}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={isLoading ? "Cargando..." : "Selecciona un cargo"} />
                </SelectTrigger>
                <SelectContent>
                  {cargos?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearch}
              disabled={!cargo}
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

export default Index;
