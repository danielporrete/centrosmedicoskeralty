import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(current.trim());
        current = "";
      } else if (char === '\n' || (char === '\r' && text[i + 1] === '\n')) {
        if (char === '\r') i++;
        row.push(current.trim());
        current = "";
        if (row.length >= 5 && row[0] && row[1] && row[2] && row[3]) {
          rows.push(row);
        }
        row = [];
      } else {
        current += char;
      }
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.length >= 5 && row[0] && row[1] && row[2] && row[3]) rows.push(row);
  }
  return rows;
}

const ImportSedesColores = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    setStatus("Descargando CSV...");
    try {
      const res = await fetch("/sedes_servicios_colores.csv");
      const text = await res.text();
      const allRows = parseCSV(text);
      const dataRows = allRows.filter(r => r[0] !== "SEDE  REPS" && r[0] !== "SEDE REPS");
      setStatus(`Parseadas ${dataRows.length} filas. Insertando...`);

      const batchSize = 100;
      let inserted = 0;
      for (let i = 0; i < dataRows.length; i += batchSize) {
        const batch = dataRows.slice(i, i + batchSize).map((r) => ({
          sede_reps: r[0] || null,
          ciudad: r[1] || null,
          nombre_sede: r[2] || null,
          servicio: r[3] || null,
          linea: r[4] || null,
        }));
        const { error } = await supabase.from("sedes_servicios_colores").insert(batch);
        if (error) {
          setStatus(`Error en batch ${i}: ${error.message}`);
          setLoading(false);
          return;
        }
        inserted += batch.length;
        setStatus(`Insertadas ${inserted} de ${dataRows.length} filas...`);
      }
      setStatus(`✅ Importación completa: ${inserted} registros insertados.`);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-6 py-12">
        <h2 className="text-2xl font-bold text-primary">Importar Sedes y Servicios (Colores)</h2>
        <p className="text-muted-foreground">Carga los datos de sedes, servicios y líneas a la base de datos.</p>
        <Button onClick={handleImport} disabled={loading} size="lg">
          {loading ? "Importando..." : "Iniciar Importación"}
        </Button>
        {status && <p className="text-sm whitespace-pre-wrap">{status}</p>}
      </div>
    </Layout>
  );
};

export default ImportSedesColores;
