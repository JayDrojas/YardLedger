import { supabase } from '../config/supabase';

function generateCode(): string {
  // 6-digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createAccessCode(createdBy: string): Promise<string> {
  const code = generateCode();
  const { error } = await supabase
    .from('access_codes')
    .insert({ code, created_by: createdBy });
  if (error) throw error;
  return code;
}

export async function validateAccessCode(code: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('access_codes')
    .select('id')
    .eq('code', code)
    .limit(1)
    .single();

  return !error && !!data;
}
