-- Add UPDATE policy for anonymous users on patient_records
CREATE POLICY "Allow update for anon on patient_records"
ON public.patient_records
FOR UPDATE
USING (true);