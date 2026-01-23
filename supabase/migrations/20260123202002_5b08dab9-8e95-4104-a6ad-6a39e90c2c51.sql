-- Add Stripe receipt URL to transactions table for viewing receipts
ALTER TABLE public.transactions
ADD COLUMN stripe_receipt_url TEXT;

-- Add Stripe fields to patient_records for quick access
ALTER TABLE public.patient_records
ADD COLUMN stripe_payment_intent_id TEXT,
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_receipt_url TEXT;