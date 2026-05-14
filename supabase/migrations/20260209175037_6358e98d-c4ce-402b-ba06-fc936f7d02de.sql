CREATE POLICY "Users can update their own analyses"
ON public.analysis_history
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);