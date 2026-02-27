import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCourses } from "@/hooks/useFilterData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Layers, Building2 } from "lucide-react";

const Resultados = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const filters = {
    categoryId: params.get("category") || undefined,
    levelId: params.get("level") || undefined,
    areaId: params.get("area") || undefined,
  };

  const { data: courses, isLoading } = useCourses(filters);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary">Resultados</h2>
            <p className="text-muted-foreground">
              {isLoading
                ? "Buscando cursos..."
                : `${courses?.length ?? 0} curso(s) encontrado(s)`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <BookOpen className="w-16 h-16 text-muted-foreground/40" />
            <p className="text-lg text-muted-foreground">
              No se encontraron cursos con los filtros seleccionados.
            </p>
            <Button variant="outline" onClick={() => navigate("/")}>
              Cambiar filtros
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

function CourseCard({ course }: { course: any }) {
  const categoryName = course.categories?.name ?? "Sin categoría";
  const levelName = course.levels?.name ?? "";
  const areaName = course.areas?.name ?? "";

  return (
    <div className="group bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <Badge
          variant="secondary"
          className="bg-secondary/15 text-secondary border-0 font-medium"
        >
          {categoryName}
        </Badge>
        {levelName && (
          <Badge
            variant="outline"
            className="border-accent text-accent font-medium"
          >
            {levelName}
          </Badge>
        )}
      </div>

      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
        {course.title}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-3">
        {course.description}
      </p>

      <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
        {course.duration && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
        )}
        {areaName && (
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            {areaName}
          </span>
        )}
      </div>
    </div>
  );
}

export default Resultados;
