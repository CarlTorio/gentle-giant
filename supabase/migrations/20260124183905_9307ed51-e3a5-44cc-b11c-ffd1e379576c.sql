-- Add DELETE policy for anon users on patient_records table
CREATE POLICY "Allow delete for anon on patient_records" 
ON public.patient_records 
FOR DELETE 
USING (true);

-- Add DELETE policy for anon users on bookings table
CREATE POLICY "Allow delete for anon on bookings" 
ON public.bookings 
FOR DELETE 
USING (true);

-- Add DELETE policy for anon users on members table  
CREATE POLICY "Allow delete for anon on members" 
ON public.members 
FOR DELETE 
USING (true);