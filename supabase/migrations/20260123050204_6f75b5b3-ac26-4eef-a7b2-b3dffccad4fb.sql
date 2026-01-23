-- Add Stripe payment tracking columns to members table
ALTER TABLE public.members
ADD COLUMN stripe_customer_id text,
ADD COLUMN stripe_payment_intent_id text,
ADD COLUMN payment_method_type text,
ADD COLUMN payment_method_details text;

-- Add comments for clarity
COMMENT ON COLUMN public.members.stripe_customer_id IS 'Stripe customer ID for recurring payments';
COMMENT ON COLUMN public.members.stripe_payment_intent_id IS 'Stripe payment intent or checkout session ID';
COMMENT ON COLUMN public.members.payment_method_type IS 'Payment method type: card, gcash, grabpay, bank_transfer, etc.';
COMMENT ON COLUMN public.members.payment_method_details IS 'Human-readable payment details like "Visa •••• 4242" or "GCash"';