
-- Allow public inserts for the import process
CREATE POLICY "Public insert malla_formacion" ON public.malla_formacion
  FOR INSERT WITH CHECK (true);
