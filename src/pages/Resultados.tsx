import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCargos, useLineasByCargo, useServiciosByLinea, useCursosByCargo } from "@/hooks/useFilterData";
import { Search, SlidersHorizontal, BookOpen, GraduationCap, Award } from "lucide-react";
import KeraltyLogo from "@/components/KeraltyLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const Resultados = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const [cargo, setCargo] = useState<string>(params.get("cargo") || "");
  const [linea, setLinea] = useState<string>(params.get("linea") || "");
  const [servicio, setServicio] = useState<string>(params.get("servicio") || "");

  const { data: cargos, isLoading } = useCargos();
  const { data: lineas, isLoading: isLoadingLineas } = useLineasByCargo(cargo || undefined);
  const { data: servicios, isLoading: isLoadingServicios } = useServiciosByLinea(linea || undefined);

  const handleCargoChange = (value: string) => {
    setCargo(value);
    setLinea("");
    setServicio("");
  };

  const handleLineaChange = (value: string) => {
    setLinea(value);
    setServicio("");
  };

  const handleSearch = () => {
    const p = new URLSearchParams();
    if (cargo) p.set("cargo", cargo);
    if (linea) p.set("linea", linea);
    if (servicio) p.set("servicio", servicio);
    setParams(p);
  };

  const sections = [
    {
      title: "Ejes formativos esenciales",
      icon: BookOpen,
      color: "bg-primary/10 text-primary",
      borderColor: "border-primary/20",
    },
    {
      title: "Ejes formativos fundamentales",
      icon: GraduationCap,
      color: "bg-secondary/10 text-secondary",
      borderColor: "border-secondary/20",
    },
    {
      title: "Ejes formativos diferenciales",
      icon: Award,
      color: "bg-accent/10 text-accent",
      borderColor: "border-accent/20",
    },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        {/* Sidebar with filters */}
        <Sidebar collapsible="icon" className="border-r border-border">
          <SidebarHeader className="p-4 border-b border-border">
            <KeraltyLogo className="h-8 mx-auto" />
          </SidebarHeader>
          <SidebarContent className="p-0">
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Filtros
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-4 space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Cargo</label>
                  <Select value={cargo} onValueChange={handleCargoChange}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder={isLoading ? "Cargando..." : "Cargo"} />
                    </SelectTrigger>
                    <SelectContent>
                      {cargos?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Línea</label>
                  <Select value={linea} onValueChange={handleLineaChange} disabled={!cargo}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder={!cargo ? "Selecciona cargo" : isLoadingLineas ? "Cargando..." : "Línea"} />
                    </SelectTrigger>
                    <SelectContent>
                      {lineas?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Servicio</label>
                  <Select value={servicio} onValueChange={setServicio} disabled={!linea}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder={!linea ? "Selecciona línea" : isLoadingServicios ? "Cargando..." : "Servicio"} />
                    </SelectTrigger>
                    <SelectContent>
                      {servicios?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSearch} disabled={!cargo} className="w-full h-9 text-sm font-semibold gap-2" size="sm">
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="mr-3" />
            <h1 className="text-lg font-bold text-primary">Asignación de Cursos</h1>
          </header>

          <main className="flex-1 p-6 space-y-6 bg-background overflow-auto">
            {/* Summary bar */}
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {cargo && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{cargo}</span>}
              {linea && <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">{linea}</span>}
              {servicio && <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">{servicio}</span>}
            </div>

            {/* 3 Horizontal Sections */}
            <div className="space-y-6">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className={`rounded-2xl border ${section.borderColor} bg-card p-6`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${section.color}`}>
                      <section.icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                  </div>
                  <div className="min-h-[120px] flex items-center justify-center text-muted-foreground text-sm">
                    Contenido próximamente...
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Resultados;
