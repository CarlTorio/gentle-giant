-- Add missing columns to appointments table
ALTER TABLE public.appointments 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS reference_number TEXT,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Allow updating appointments (for admin)
CREATE POLICY "Anyone can update appointments" ON public.appointments
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow deleting appointments (for admin)
CREATE POLICY "Anyone can delete appointments" ON public.appointments
  FOR DELETE USING (true);