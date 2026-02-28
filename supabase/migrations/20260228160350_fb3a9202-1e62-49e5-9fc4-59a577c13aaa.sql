
CREATE TABLE public.malla_diferenciales (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  linea text,
  diferencial_linea text,
  objetivo_aprendizaje_linea text,
  diferencial_servicio text,
  servicio text,
  objetivo_aprendizaje_servicio text
);

ALTER TABLE public.malla_diferenciales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read malla_diferenciales" ON public.malla_diferenciales
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert malla_diferenciales" ON public.malla_diferenciales
  FOR INSERT WITH CHECK (true);
