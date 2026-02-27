-- Create appointments table for booking consultations
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service_category TEXT,
  specific_service TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  condition_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create appointments (public booking form)
CREATE POLICY "Anyone can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (true);

-- Allow reading appointments (for admin use)
CREATE POLICY "Appointments are readable" ON public.appointments
  FOR SELECT USING (true);