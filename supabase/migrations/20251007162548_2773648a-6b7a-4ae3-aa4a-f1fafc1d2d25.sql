-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Admin can insert messages for any user" ON public.messages;
DROP POLICY IF EXISTS "Admin can update seen status" ON public.messages;

-- Create a security definer function to check if user is admin
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = _user_id),
    false
  )
$$;

-- Recreate profiles policies using the security definer function
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- Recreate messages policies using the security definer function
CREATE POLICY "Users can view own messages"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admin can insert messages for any user"
  ON public.messages
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin can update seen status"
  ON public.messages
  FOR UPDATE
  USING (public.is_admin(auth.uid()));