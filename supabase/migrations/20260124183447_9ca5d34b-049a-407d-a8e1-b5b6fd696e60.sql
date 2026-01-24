-- Add UPDATE policy for anon users on members table
CREATE POLICY "Allow update for anon on members" 
ON public.members 
FOR UPDATE 
USING (true);