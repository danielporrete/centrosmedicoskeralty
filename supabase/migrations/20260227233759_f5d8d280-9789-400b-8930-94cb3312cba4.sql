
-- Create malla_formacion table from CSV structure
CREATE TABLE public.malla_formacion (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agrupacion TEXT,
  cargo TEXT,
  responsable TEXT,
  linea TEXT,
  herramienta_tecnologica TEXT,
  esencial TEXT,
  objetivo_aprendizaje TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.malla_formacion ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read malla_formacion" ON public.malla_formacion
  FOR SELECT USING (true);
