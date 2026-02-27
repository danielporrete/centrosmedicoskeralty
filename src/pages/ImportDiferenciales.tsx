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
        if (row.length >= 4) rows.push(row);
        row = [];
      } else {
        current += char;
      }
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.length >= 4) rows.push(row);
  }
  return rows;
}

const ImportDiferenciales = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    setStatus("Descargando CSV...");
    try {
      const res = await fetch("/diferenciales.csv");
      const text = await res.text();
      const rows = parseCSV(text);
      const dataRows = rows.slice(1);
      setStatus(`Parseadas ${dataRows.length} filas. Insertando...`);

      const batch = dataRows.map((r) => ({
        diferencial_linea: r[0] || null,
        objetivo_aprendizaje_linea: r[1] || null,
        diferencial_servicio: r[2] || null,
        objetivo_aprendizaje_servicio: r[3] || null,
      }));

      const { error } = await supabase.from("malla_diferenciales").insert(batch);
      if (error) {
        setStatus(`Error: ${error.message}`);
        setLoading(false);
        return;
      }
      setStatus(`✅ Importación completa: ${batch.length} registros insertados.`);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-6 py-12">
        <h2 className="text-2xl font-bold text-primary">Importar Malla Diferenciales</h2>
        <p className="text-muted-foreground">Carga los datos del CSV Diferenciales a la base de datos.</p>
        <Button onClick={handleImport} disabled={loading} size="lg">
          {loading ? "Importando..." : "Iniciar Importación"}
        </Button>
        {status && <p className="text-sm whitespace-pre-wrap">{status}</p>}
      </div>
    </Layout>
  );
};

export default ImportDiferenciales;
