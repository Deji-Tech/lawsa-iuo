-- Update profiles table to include phone number
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Update the handle_new_user function to include phone_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, level, phone_number, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'level',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
