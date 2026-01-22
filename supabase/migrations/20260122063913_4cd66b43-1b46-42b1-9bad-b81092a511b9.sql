-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  membership TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create membership_applications table
CREATE TABLE public.membership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  applied_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  join_date TEXT NOT NULL,
  last_payment TEXT,
  expiration_date TEXT NOT NULL,
  total_paid NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for now, until auth is implemented)
CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete bookings" ON public.bookings FOR DELETE USING (true);

CREATE POLICY "Allow public read applications" ON public.membership_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert applications" ON public.membership_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update applications" ON public.membership_applications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete applications" ON public.membership_applications FOR DELETE USING (true);

CREATE POLICY "Allow public read members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Allow public insert members" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update members" ON public.members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete members" ON public.members FOR DELETE USING (true);