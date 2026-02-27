
CREATE TABLE public.malla_fundamental (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agrupacion TEXT,
  cargo TEXT,
  responsable TEXT,
  linea TEXT,
  fundamental TEXT,
  objetivo_aprendizaje TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.malla_fundamental ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read malla_fundamental" ON public.malla_fundamental
  FOR SELECT USING (true);

-- Temporary insert policy for import
CREATE POLICY "Public insert malla_fundamental" ON public.malla_fundamental
  FOR INSERT WITH CHECK (true);
