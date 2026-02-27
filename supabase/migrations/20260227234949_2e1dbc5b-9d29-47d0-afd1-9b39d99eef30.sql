
CREATE TABLE public.malla_diferenciales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  diferencial_linea TEXT,
  objetivo_aprendizaje_linea TEXT,
  diferencial_servicio TEXT,
  objetivo_aprendizaje_servicio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.malla_diferenciales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read malla_diferenciales" ON public.malla_diferenciales
  FOR SELECT USING (true);

CREATE POLICY "Public insert malla_diferenciales" ON public.malla_diferenciales
  FOR INSERT WITH CHECK (true);
