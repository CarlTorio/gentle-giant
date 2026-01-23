-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  membership TEXT NOT NULL DEFAULT 'Green',
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient_records table
CREATE TABLE public.patient_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  membership TEXT NOT NULL DEFAULT 'Green',
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings (public read/insert for booking form, admin manages)
CREATE POLICY "Anyone can view bookings"
  ON public.bookings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update bookings"
  ON public.bookings FOR UPDATE
  USING (true);

-- Create policies for patient_records (admin access)
CREATE POLICY "Anyone can view patient records"
  ON public.patient_records FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create patient records"
  ON public.patient_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update patient records"
  ON public.patient_records FOR UPDATE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_records_updated_at
  BEFORE UPDATE ON public.patient_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();