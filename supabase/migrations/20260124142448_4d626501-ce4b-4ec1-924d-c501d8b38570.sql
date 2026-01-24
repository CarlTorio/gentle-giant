-- =============================================
-- HILOME DATABASE SCHEMA
-- Database: PostgreSQL (Supabase)
-- =============================================

-- =============================================
-- TABLE 1: BOOKINGS
-- Stores appointment/consultation bookings
-- =============================================

CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    membership TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- TABLE 2: MEMBERS
-- Stores membership subscriptions and payments
-- =============================================

CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT NULL,
    membership_type TEXT NOT NULL DEFAULT 'green',
    membership_start_date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
    membership_expiry_date TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT NULL,
    amount_paid NUMERIC DEFAULT NULL,
    is_walk_in BOOLEAN NOT NULL DEFAULT false,
    referral_code TEXT DEFAULT NULL,
    referred_by TEXT DEFAULT NULL,
    referral_count INTEGER NOT NULL DEFAULT 0,
    stripe_payment_intent_id TEXT DEFAULT NULL,
    stripe_charge_id TEXT DEFAULT NULL,
    stripe_receipt_url TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- TABLE 3: PATIENT_RECORDS
-- Stores patient medical records and history
-- =============================================

CREATE TABLE public.patient_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT DEFAULT NULL,
    preferred_date TEXT DEFAULT NULL,
    preferred_time TEXT DEFAULT NULL,
    membership TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    booking_id UUID DEFAULT NULL REFERENCES public.bookings(id) ON DELETE SET NULL,
    -- Patient demographics
    date_of_birth TEXT DEFAULT NULL,
    age INTEGER DEFAULT NULL,
    gender TEXT DEFAULT NULL,
    emergency_contact TEXT DEFAULT NULL,
    -- Membership details (synced from members table)
    membership_join_date TEXT DEFAULT NULL,
    membership_expiry_date TEXT DEFAULT NULL,
    membership_status TEXT DEFAULT NULL,
    -- Medical records stored as JSON array
    medical_records JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- TABLE 4: TRANSACTIONS
-- Stores payment transactions for members
-- =============================================

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID DEFAULT NULL REFERENCES public.members(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT DEFAULT NULL,
    payment_method TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_preferred_date ON public.bookings(preferred_date);

CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_members_status ON public.members(status);
CREATE INDEX idx_members_referral_code ON public.members(referral_code);

CREATE INDEX idx_patient_records_email ON public.patient_records(email);
CREATE INDEX idx_patient_records_booking_id ON public.patient_records(booking_id);

CREATE INDEX idx_transactions_member_id ON public.transactions(member_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);

-- =============================================
-- TRIGGER: AUTO-UPDATE updated_at TIMESTAMP
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_records_updated_at
    BEFORE UPDATE ON public.patient_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TRIGGER: SYNC MEMBER TO PATIENT RECORD
-- When a member is confirmed, create/update patient record
-- =============================================

-- Add unique constraint on email for patient_records (for upsert)
ALTER TABLE public.patient_records ADD CONSTRAINT patient_records_email_unique UNIQUE (email);

CREATE OR REPLACE FUNCTION sync_member_to_patient_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Only sync when member status changes to 'active'
    IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
        INSERT INTO public.patient_records (
            name,
            email,
            contact_number,
            membership,
            membership_join_date,
            membership_expiry_date,
            membership_status
        )
        VALUES (
            NEW.name,
            NEW.email,
            NEW.phone,
            NEW.membership_type,
            NEW.membership_start_date,
            NEW.membership_expiry_date,
            NEW.status
        )
        ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            contact_number = EXCLUDED.contact_number,
            membership = EXCLUDED.membership,
            membership_join_date = EXCLUDED.membership_join_date,
            membership_expiry_date = EXCLUDED.membership_expiry_date,
            membership_status = EXCLUDED.membership_status,
            updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_member_to_patient
    AFTER INSERT OR UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION sync_member_to_patient_record();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated" ON public.bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON public.members
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON public.patient_records
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON public.transactions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also allow anonymous access for public booking form
CREATE POLICY "Allow insert for anon" ON public.bookings
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.members
    FOR INSERT TO anon WITH CHECK (true);