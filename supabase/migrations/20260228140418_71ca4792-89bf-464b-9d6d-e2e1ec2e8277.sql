
CREATE TABLE public.sedes_servicios_colores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sede_reps TEXT,
  ciudad TEXT,
  nombre_sede TEXT,
  servicio TEXT,
  linea TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sedes_servicios_colores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sedes_servicios_colores"
ON public.sedes_servicios_colores
FOR SELECT
USING (true);
