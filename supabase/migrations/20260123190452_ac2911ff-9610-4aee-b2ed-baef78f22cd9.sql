-- Create a separate patient_records table
CREATE TABLE public.patient_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  membership TEXT NOT NULL DEFAULT 'Not a member',
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

-- Create policies for patient_records
CREATE POLICY "Anyone can view patient records" 
ON public.patient_records 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create patient records" 
ON public.patient_records 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update patient records" 
ON public.patient_records 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete patient records" 
ON public.patient_records 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_patient_records_updated_at
BEFORE UPDATE ON public.patient_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();