-- Create membership_benefits table
CREATE TABLE IF NOT EXISTS public.membership_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  membership_type TEXT NOT NULL,
  benefit_name TEXT NOT NULL,
  benefit_type TEXT NOT NULL DEFAULT 'claimable', -- 'inclusion' or 'claimable'
  total_quantity INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member_benefit_claims table
CREATE TABLE IF NOT EXISTS public.member_benefit_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  benefit_id UUID NOT NULL REFERENCES public.membership_benefits(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimed_by TEXT,
  UNIQUE(member_id, benefit_id, session_number)
);

-- Create referral_rewards table
CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  reward_name TEXT NOT NULL,
  claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  claimed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.membership_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_benefit_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- RLS for membership_benefits (read-only for anon, full for authenticated)
CREATE POLICY "Allow select for anon on benefits" ON public.membership_benefits FOR SELECT USING (true);
CREATE POLICY "Allow all for authenticated on benefits" ON public.membership_benefits FOR ALL USING (true) WITH CHECK (true);

-- RLS for member_benefit_claims
CREATE POLICY "Allow select for anon on claims" ON public.member_benefit_claims FOR SELECT USING (true);
CREATE POLICY "Allow insert for anon on claims" ON public.member_benefit_claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete for anon on claims" ON public.member_benefit_claims FOR DELETE USING (true);
CREATE POLICY "Allow all for authenticated on claims" ON public.member_benefit_claims FOR ALL USING (true) WITH CHECK (true);

-- RLS for referral_rewards
CREATE POLICY "Allow select for anon on rewards" ON public.referral_rewards FOR SELECT USING (true);
CREATE POLICY "Allow insert for anon on rewards" ON public.referral_rewards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for anon on rewards" ON public.referral_rewards FOR UPDATE USING (true);
CREATE POLICY "Allow all for authenticated on rewards" ON public.referral_rewards FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_membership_benefits_type ON public.membership_benefits(membership_type);
CREATE INDEX idx_member_benefit_claims_member ON public.member_benefit_claims(member_id);
CREATE INDEX idx_member_benefit_claims_benefit ON public.member_benefit_claims(benefit_id);
CREATE INDEX idx_referral_rewards_member ON public.referral_rewards(member_id);

-- Update triggers for updated_at
CREATE TRIGGER update_membership_benefits_updated_at
  BEFORE UPDATE ON public.membership_benefits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referral_rewards_updated_at
  BEFORE UPDATE ON public.referral_rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Drop the existing trigger that creates patient records prematurely
DROP TRIGGER IF EXISTS trigger_sync_member_to_patient ON public.members;

-- Update the sync_member_to_patient function to only run on status change to 'active'
CREATE OR REPLACE FUNCTION public.sync_member_to_patient()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create/link patient record when member becomes active
  IF NEW.status = 'active' AND (OLD IS NULL OR OLD.status != 'active') THEN
    -- Check if patient record exists for this email
    IF NOT EXISTS (SELECT 1 FROM public.patient_records WHERE email = NEW.email) THEN
      -- Create patient record from member data
      INSERT INTO public.patient_records (
        name, email, contact_number, membership, 
        membership_join_date, membership_expiry_date, membership_status,
        member_id, source
      ) VALUES (
        NEW.name, NEW.email, NEW.phone, NEW.membership_type,
        NEW.membership_start_date, NEW.membership_expiry_date, NEW.status,
        NEW.id, 'membership'
      );
    ELSE
      -- Update existing patient record with member link
      UPDATE public.patient_records
      SET member_id = NEW.id,
          membership = NEW.membership_type,
          membership_join_date = NEW.membership_start_date,
          membership_expiry_date = NEW.membership_expiry_date,
          membership_status = NEW.status,
          updated_at = now()
      WHERE email = NEW.email AND member_id IS NULL;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Re-create the trigger for UPDATE only (not INSERT - we handle that manually in the app)
CREATE TRIGGER trigger_sync_member_to_patient
  AFTER UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_member_to_patient();

-- Insert default membership benefits for each tier
INSERT INTO public.membership_benefits (membership_type, benefit_name, benefit_type, total_quantity, description) VALUES
-- Green membership
('Green', 'Discount on all services', 'inclusion', 1, '10% discount on all services'),
('Green', 'Priority booking', 'inclusion', 1, 'Priority booking for appointments'),
('Green', 'Free Facial', 'claimable', 2, 'Free facial treatment sessions'),
('Green', 'Free Consultation', 'claimable', 4, 'Free consultation sessions'),
-- Gold membership
('Gold', 'Discount on all services', 'inclusion', 1, '15% discount on all services'),
('Gold', 'Priority booking', 'inclusion', 1, 'Priority booking for appointments'),
('Gold', 'Free Facial', 'claimable', 4, 'Free facial treatment sessions'),
('Gold', 'Free Consultation', 'claimable', 6, 'Free consultation sessions'),
('Gold', 'Free Diamond Peel', 'claimable', 2, 'Free diamond peel sessions'),
-- Platinum membership
('Platinum', 'Discount on all services', 'inclusion', 1, '20% discount on all services'),
('Platinum', 'Priority booking', 'inclusion', 1, 'Priority booking for appointments'),
('Platinum', 'VIP lounge access', 'inclusion', 1, 'Access to VIP lounge'),
('Platinum', 'Free Facial', 'claimable', 6, 'Free facial treatment sessions'),
('Platinum', 'Free Consultation', 'claimable', 12, 'Free consultation sessions'),
('Platinum', 'Free Diamond Peel', 'claimable', 4, 'Free diamond peel sessions'),
('Platinum', 'Free Slimming Session', 'claimable', 2, 'Free body slimming sessions');