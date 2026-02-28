import { useState, ReactNode } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCargos, useLineasByCargo, useServiciosByLinea, useCursosByCargo, useFundamentalesByCargo, useHerramientaTecnologica, useDiferencialesByLinea } from "@/hooks/useFilterData";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, BookOpen, GraduationCap, Award, AlignLeft, Table } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  const [viewMode, setViewMode] = useState<string>("texto");
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (idx: number) =>
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const { data: cargos, isLoading } = useCargos();
  const { data: lineas, isLoading: isLoadingLineas } = useLineasByCargo(cargo || undefined);
  const { data: servicios, isLoading: isLoadingServicios } = useServiciosByLinea(linea || undefined);
  const { data: cursosMalla, isLoading: isLoadingCursos } = useCursosByCargo(
    params.get("cargo") || undefined,
    params.get("linea") || undefined
  );
  const { data: fundamentales, isLoading: isLoadingFundamentales } = useFundamentalesByCargo(
    params.get("cargo") || undefined,
    params.get("linea") || undefined
  );
  const { data: herramientaTag } = useHerramientaTecnologica(
    params.get("cargo") || undefined,
    params.get("linea") || undefined
  );
  const { data: diferencialLinea, isLoading: isLoadingDiferenciales } = useDiferencialesByLinea(
    params.get("linea") || undefined
  );

  // Split esenciales into Normativos (matching selected linea) and Centros Médicos
  const esenciales = cursosMalla?.filter((c: any) => c.esencial) || [];
  const normativos = esenciales.filter((c: any) => c.linea !== "Temas específicos centros médicos");
  const centrosMedicos = esenciales.filter((c: any) => c.linea === "Temas específicos centros médicos");

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
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {cargo && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{cargo}</span>}
                {linea && <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">{linea}</span>}
                {servicio && <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">{servicio}</span>}
              </div>
              <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v)} className="border border-border rounded-lg p-0.5">
                <ToggleGroupItem value="texto" aria-label="Vista texto" className="h-8 px-3 text-xs font-semibold gap-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  <AlignLeft className="w-3.5 h-3.5" />
                  Texto
                </ToggleGroupItem>
                <ToggleGroupItem value="tabla" aria-label="Vista tabla" className="h-8 px-3 text-xs font-semibold gap-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  <Table className="w-3.5 h-3.5" />
                  Tabla
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* 3 Horizontal Sections */}
            <div className="space-y-6">
              {/* Ejes formativos esenciales */}
              <section className={`rounded-2xl border ${sections[0].borderColor} bg-card p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${sections[0].color}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{sections[0].title}</h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toggleCollapse(0)} className="text-xs">
                    {collapsed[0] ? "Expandir" : "Minimizar"}
                  </Button>
                </div>

                {!collapsed[0] && (
                <>
                {/* Subsección Normativos */}
                <div className="mb-6">
                  <h3 className="text-base font-bold text-foreground border-b border-border pb-2 mb-3">Normativos</h3>
                  {isLoadingCursos ? (
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                  ) : normativos.length > 0 ? (
                    viewMode === "tabla" ? (
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-bold">Esencial</TableHead>
                            <TableHead className="font-bold">Objetivo de aprendizaje</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {normativos.map((item: any) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-bold text-foreground text-sm">{item.esencial}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">{item.objetivo_aprendizaje}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </UITable>
                    ) : (
                      <div className="space-y-4">
                        {normativos.map((item: any) => (
                          <div key={item.id} className="pl-3 border-l-2 border-primary/30">
                            <p className="font-bold text-foreground text-sm">{item.esencial}</p>
                            {item.objetivo_aprendizaje && (
                              <p className="text-muted-foreground text-sm mt-1">{item.objetivo_aprendizaje}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">Sin resultados para los filtros seleccionados.</p>
                  )}
                </div>

                {/* Subsección Centros Médicos */}
                <div>
                  <h3 className="text-base font-bold text-foreground border-b border-border pb-2 mb-3">Centros Médicos</h3>
                  {(() => {
                    const centrosMedicosData = [
                      { titulo: "Modelo de atención primaria", objetivo: "Comprender los principios del modelo de atención primaria en salud y su aplicación en los servicios, promoviendo la promoción de la salud, la prevención de la enfermedad y la atención integral centrada en la persona y la comunidad." },
                      { titulo: "Seguridad del paciente", objetivo: "Identificar los riesgos asociados a la atención en salud y aplicar prácticas seguras para prevenir eventos adversos, fortaleciendo la cultura de seguridad del paciente." },
                      { titulo: "Humanización", objetivo: "Aplicar principios de humanización en la atención en salud, promoviendo el trato digno, empático y respetuoso hacia los usuarios, familias y cuidadores." },
                      { titulo: "Protocolos Generales", objetivo: "Reconocer y aplicar los protocolos generales institucionales para estandarizar la atención, mejorar la calidad del servicio y garantizar la seguridad del paciente." },
                      { titulo: "Bioseguridad y control de infecciones EPP", objetivo: "Aplicar las normas de bioseguridad, prevención y control de infecciones, incluyendo el uso adecuado de los elementos de protección personal (EPP), para proteger al paciente y al personal de salud." },
                      { titulo: "Tecnovigilancia - Uso de dispositivos médicos", objetivo: "Identificar y reportar eventos e incidentes relacionados con dispositivos médicos, aplicando los principios de tecnovigilancia para garantizar su uso seguro y eficaz." },
                      { titulo: "Curso Integral - Servicios Centros Medicos", objetivo: "Desarrollar en los participantes la capacidad de comprender, articular y aplicar de manera integrada todos los servicios que ofrecen los centros medicos, garantizando una visión sistémica que permita optimizar procesos y mejorar la experiencia de los usuarios." },
                    ];
                    return viewMode === "tabla" ? (
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-bold">Esencial</TableHead>
                            <TableHead className="font-bold">Objetivo de aprendizaje</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {centrosMedicosData.map((item) => (
                            <TableRow key={item.titulo}>
                              <TableCell className="font-bold text-foreground text-sm">{item.titulo}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">{item.objetivo}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </UITable>
                    ) : (
                      <div className="space-y-4">
                        {centrosMedicosData.map((item) => (
                          <div key={item.titulo} className="pl-3 border-l-2 border-primary/30">
                            <p className="font-bold text-foreground text-sm">{item.titulo}</p>
                            <p className="text-muted-foreground text-sm mt-1">{item.objetivo}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                </>
                )}
              </section>

              {/* Ejes formativos fundamentales & diferenciales */}
              {sections.slice(1).map((section, i) => {
                const idx = i + 1;
                const isFundamental = idx === 1;
                const fundamentalData = fundamentales || [];
                return (
                  <section
                    key={section.title}
                    className={`rounded-2xl border ${section.borderColor} bg-card p-6`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${section.color}`}>
                          <section.icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toggleCollapse(idx)} className="text-xs">
                        {collapsed[idx] ? "Expandir" : "Minimizar"}
                      </Button>
                    </div>
                    {!collapsed[idx] && (
                      isFundamental ? (
                        <>
                        {/* Subsección Fundamentales */}
                        <div className="mb-6">
                          <h3 className="text-base font-bold text-foreground border-b border-border pb-2 mb-3">Fundamentales</h3>
                          {isLoadingFundamentales ? (
                            <p className="text-sm text-muted-foreground">Cargando...</p>
                          ) : fundamentalData.length > 0 ? (
                            viewMode === "tabla" ? (
                              <UITable>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="font-bold">Fundamental</TableHead>
                                    <TableHead className="font-bold">Objetivo de aprendizaje</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {fundamentalData.map((item: any) => (
                                    <TableRow key={item.id}>
                                      <TableCell className="font-bold text-foreground text-sm">{item.fundamental}</TableCell>
                                      <TableCell className="text-muted-foreground text-sm">{item.objetivo_aprendizaje}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </UITable>
                            ) : (
                              <div className="space-y-4">
                                {fundamentalData.map((item: any) => (
                                  <div key={item.id} className="pl-3 border-l-2 border-secondary/30">
                                    <p className="font-bold text-foreground text-sm">{item.fundamental}</p>
                                    {item.objetivo_aprendizaje && (
                                      <p className="text-muted-foreground text-sm mt-1">{item.objetivo_aprendizaje}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )
                          ) : (
                            <p className="text-sm text-muted-foreground">Sin resultados para los filtros seleccionados.</p>
                          )}
                        </div>

                        {/* Subsección Plataforma Tecnológica */}
                        <div>
                          <h3 className="text-base font-bold text-foreground border-b border-border pb-2 mb-3">Plataforma Tecnológica</h3>
                          {herramientaTag ? (
                            <div className="pl-3 border-l-2 border-secondary/30">
                              <p className="font-bold text-foreground text-sm">{herramientaTag}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Sin información disponible.</p>
                          )}
                        </div>
                        </>
                      ) : (
                        <>
                        {/* Subsección Curso */}
                        <div className="mb-6">
                          <h3 className="text-base font-bold text-foreground border-b border-border pb-2 mb-3">Curso</h3>
                          {isLoadingDiferenciales ? (
                            <p className="text-sm text-muted-foreground">Cargando...</p>
                          ) : diferencialLinea ? (
                            viewMode === "tabla" ? (
                              <UITable>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="font-bold">Diferencial</TableHead>
                                    <TableHead className="font-bold">Objetivo de aprendizaje</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-bold text-foreground text-sm">{diferencialLinea.titulo}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{diferencialLinea.objetivo}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </UITable>
                            ) : (
                              <div className="pl-3 border-l-2 border-accent/30">
                                <p className="font-bold text-foreground text-sm">{diferencialLinea.titulo}</p>
                                {diferencialLinea.objetivo && (
                                  <p className="text-muted-foreground text-sm mt-1">{diferencialLinea.objetivo}</p>
                                )}
                              </div>
                            )
                          ) : (
                            <p className="text-sm text-muted-foreground">Sin resultados para los filtros seleccionados.</p>
                          )}
                        </div>

                        {/* Subsección Servicio */}
                        <div>
                          <h3 className="text-base font-bold text-foreground border-b border-border pb-2 mb-3">Servicio</h3>
                          <p className="text-sm text-muted-foreground">Contenido próximamente...</p>
                        </div>
                        </>
                      )
                    )}
                  </section>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Resultados;
