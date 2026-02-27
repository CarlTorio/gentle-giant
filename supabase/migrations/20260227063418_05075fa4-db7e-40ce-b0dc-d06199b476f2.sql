CREATE TABLE public.membership_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  reason_for_joining TEXT,
  how_did_you_hear TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.membership_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert membership inquiries" ON public.membership_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read membership inquiries" ON public.membership_inquiries
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update membership inquiries" ON public.membership_inquiries
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete membership inquiries" ON public.membership_inquiries
  FOR DELETE USING (true);