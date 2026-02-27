
CREATE TABLE public.sedes_servicios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sede_reps TEXT,
  ciudad TEXT,
  nombre_sede TEXT,
  servicio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sedes_servicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sedes_servicios" ON public.sedes_servicios
  FOR SELECT USING (true);

CREATE POLICY "Public insert sedes_servicios" ON public.sedes_servicios
  FOR INSERT WITH CHECK (true);
