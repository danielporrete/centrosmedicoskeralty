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
        if (row.length >= 7) {
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
    if (row.length >= 7) rows.push(row);
  }
  return rows;
}

const ImportCSV = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    setStatus("Descargando CSV...");
    try {
      const res = await fetch("/esencial.csv");
      const text = await res.text();
      const rows = parseCSV(text);
      const dataRows = rows.slice(1); // skip header
      setStatus(`Parseadas ${dataRows.length} filas. Insertando...`);

      const batchSize = 50;
      let inserted = 0;
      for (let i = 0; i < dataRows.length; i += batchSize) {
        const batch = dataRows.slice(i, i + batchSize).map((r) => ({
          agrupacion: r[0] || null,
          cargo: r[1] || null,
          responsable: r[2] || null,
          linea: r[3] || null,
          herramienta_tecnologica: r[4] || null,
          esencial: r[5] || null,
          objetivo_aprendizaje: r[6] || null,
        }));
        const { error } = await supabase.from("malla_formacion").insert(batch);
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
        <h2 className="text-2xl font-bold text-primary">Importar Malla de Formación</h2>
        <p className="text-muted-foreground">
          Esto cargará los datos del CSV a la tabla malla_formacion en la base de datos.
        </p>
        <Button onClick={handleImport} disabled={loading} size="lg">
          {loading ? "Importando..." : "Iniciar Importación"}
        </Button>
        {status && <p className="text-sm whitespace-pre-wrap">{status}</p>}
      </div>
    </Layout>
  );
};

export default ImportCSV;
