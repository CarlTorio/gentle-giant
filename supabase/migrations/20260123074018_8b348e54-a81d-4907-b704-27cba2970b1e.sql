-- Create patients table for patient records
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  emergency_contact TEXT,
  membership_type TEXT,
  membership_start_date DATE,
  membership_expiry_date DATE,
  last_visit DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (admin portal)
CREATE POLICY "Anyone can view patients" 
ON public.patients 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update patients" 
ON public.patients 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add used_referral_code column to members table to track referral code used during signup
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS used_referral_code TEXT;