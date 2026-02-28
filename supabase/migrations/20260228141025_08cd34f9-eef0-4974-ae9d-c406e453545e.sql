
CREATE POLICY "Allow public insert sedes_servicios_colores"
ON public.sedes_servicios_colores
FOR INSERT
WITH CHECK (true);
