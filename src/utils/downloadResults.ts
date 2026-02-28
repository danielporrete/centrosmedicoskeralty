import jsPDF from "jspdf";
import "jspdf-autotable";

interface CourseItem {
  seccion: string;
  subseccion: string;
  titulo: string;
  objetivo: string | null;
}

function buildAllItems(
  normativos: any[],
  centrosMedicosData: { titulo: string; objetivo: string }[],
  fundamentales: any[],
  herramientaTag: string | null,
  diferencialLinea: { titulo: string; objetivo: string | null } | null,
  diferencialServicio: { titulo: string; objetivo: string | null } | null
): CourseItem[] {
  const items: CourseItem[] = [];

  normativos.forEach((c) =>
    items.push({ seccion: "Esenciales", subseccion: "Normativos", titulo: c.esencial || "", objetivo: c.objetivo_aprendizaje || "" })
  );
  centrosMedicosData.forEach((c) =>
    items.push({ seccion: "Esenciales", subseccion: "Centros Médicos", titulo: c.titulo, objetivo: c.objetivo })
  );
  fundamentales.forEach((c) =>
    items.push({ seccion: "Fundamentales", subseccion: "Fundamentales", titulo: c.fundamental || "", objetivo: c.objetivo_aprendizaje || "" })
  );
  if (herramientaTag) {
    items.push({ seccion: "Fundamentales", subseccion: "Plataforma Tecnológica", titulo: herramientaTag, objetivo: "" });
  }
  if (diferencialLinea) {
    items.push({ seccion: "Diferenciales", subseccion: "Curso", titulo: diferencialLinea.titulo, objetivo: diferencialLinea.objetivo || "" });
  }
  if (diferencialServicio) {
    items.push({ seccion: "Diferenciales", subseccion: "Servicio", titulo: diferencialServicio.titulo, objetivo: diferencialServicio.objetivo || "" });
  }
  return items;
}

const CENTROS_MEDICOS_DATA = [
  { titulo: "Modelo de atención primaria", objetivo: "Comprender los principios del modelo de atención primaria en salud y su aplicación en los servicios, promoviendo la promoción de la salud, la prevención de la enfermedad y la atención integral centrada en la persona y la comunidad." },
  { titulo: "Seguridad del paciente", objetivo: "Identificar los riesgos asociados a la atención en salud y aplicar prácticas seguras para prevenir eventos adversos, fortaleciendo la cultura de seguridad del paciente." },
  { titulo: "Humanización", objetivo: "Aplicar principios de humanización en la atención en salud, promoviendo el trato digno, empático y respetuoso hacia los usuarios, familias y cuidadores." },
  { titulo: "Protocolos Generales", objetivo: "Reconocer y aplicar los protocolos generales institucionales para estandarizar la atención, mejorar la calidad del servicio y garantizar la seguridad del paciente." },
  { titulo: "Bioseguridad y control de infecciones EPP", objetivo: "Aplicar las normas de bioseguridad, prevención y control de infecciones, incluyendo el uso adecuado de los elementos de protección personal (EPP), para proteger al paciente y al personal de salud." },
  { titulo: "Tecnovigilancia - Uso de dispositivos médicos", objetivo: "Identificar y reportar eventos e incidentes relacionados con dispositivos médicos, aplicando los principios de tecnovigilancia para garantizar su uso seguro y eficaz." },
  { titulo: "Curso Integral - Servicios Centros Medicos", objetivo: "Desarrollar en los participantes la capacidad de comprender, articular y aplicar de manera integrada todos los servicios que ofrecen los centros medicos, garantizando una visión sistémica que permita optimizar procesos y mejorar la experiencia de los usuarios." },
];

export { CENTROS_MEDICOS_DATA };

export function downloadCSV(
  normativos: any[],
  fundamentales: any[],
  herramientaTag: string | null,
  diferencialLinea: { titulo: string; objetivo: string | null } | null,
  diferencialServicio: { titulo: string; objetivo: string | null } | null,
  filters: { cargo: string; linea: string; servicio: string }
) {
  const items = buildAllItems(normativos, CENTROS_MEDICOS_DATA, fundamentales, herramientaTag, diferencialLinea, diferencialServicio);

  const header = "Sección,Subsección,Curso,Objetivo de aprendizaje";
  const escape = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
  const rows = items.map((i) => [escape(i.seccion), escape(i.subseccion), escape(i.titulo), escape(i.objetivo || "")].join(","));

  const bom = "\uFEFF";
  const csv = bom + [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cursos_${filters.cargo}_${filters.linea || "todas"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadPDF(
  viewMode: string,
  normativos: any[],
  fundamentales: any[],
  herramientaTag: string | null,
  diferencialLinea: { titulo: string; objetivo: string | null } | null,
  diferencialServicio: { titulo: string; objetivo: string | null } | null,
  filters: { cargo: string; linea: string; servicio: string }
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Asignación de Cursos", pageWidth / 2, y, { align: "center" });
  y += 8;

  // Filters
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const filterText = [filters.cargo, filters.linea, filters.servicio].filter(Boolean).join(" | ");
  doc.text(filterText, pageWidth / 2, y, { align: "center" });
  y += 10;

  const addSection = (title: string, subsections: { name: string; items: { titulo: string; objetivo: string | null }[] }[]) => {
    // Check page space
    if (y > 260) { doc.addPage(); y = 15; }

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, y);
    y += 7;

    subsections.forEach((sub) => {
      if (sub.items.length === 0) return;
      if (y > 260) { doc.addPage(); y = 15; }

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(sub.name, 14, y);
      y += 5;

      if (viewMode === "tabla") {
        (doc as any).autoTable({
          startY: y,
          head: [["Curso", "Objetivo de aprendizaje"]],
          body: sub.items.map((i) => [i.titulo, i.objetivo || ""]),
          margin: { left: 14, right: 14 },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [0, 105, 146], fontStyle: "bold" },
          columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: "auto" } },
          didDrawPage: () => { y = 15; },
        });
        y = (doc as any).lastAutoTable.finalY + 6;
      } else {
        sub.items.forEach((item) => {
          if (y > 270) { doc.addPage(); y = 15; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          const titleLines = doc.splitTextToSize(item.titulo, pageWidth - 32);
          doc.text(titleLines, 18, y);
          y += titleLines.length * 4;
          if (item.objetivo) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            const objLines = doc.splitTextToSize(item.objetivo, pageWidth - 32);
            doc.text(objLines, 18, y);
            y += objLines.length * 3.5 + 3;
          } else {
            y += 3;
          }
        });
        y += 3;
      }
    });
  };

  addSection("Ejes formativos esenciales", [
    { name: "Normativos", items: normativos.map((c: any) => ({ titulo: c.esencial || "", objetivo: c.objetivo_aprendizaje || "" })) },
    { name: "Centros Médicos", items: CENTROS_MEDICOS_DATA },
  ]);

  addSection("Ejes formativos fundamentales", [
    { name: "Fundamentales", items: fundamentales.map((c: any) => ({ titulo: c.fundamental || "", objetivo: c.objetivo_aprendizaje || "" })) },
    { name: "Plataforma Tecnológica", items: herramientaTag ? [{ titulo: herramientaTag, objetivo: null }] : [] },
  ]);

  addSection("Ejes formativos diferenciales", [
    { name: "Curso", items: diferencialLinea ? [{ titulo: diferencialLinea.titulo, objetivo: diferencialLinea.objetivo }] : [] },
    { name: "Servicio", items: diferencialServicio ? [{ titulo: diferencialServicio.titulo, objetivo: diferencialServicio.objetivo }] : [] },
  ]);

  doc.save(`cursos_${filters.cargo}_${filters.linea || "todas"}.pdf`);
}
