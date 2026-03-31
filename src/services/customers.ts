import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  drivers_license: string;
  dl_photo_uri: string | null;
  address: string;
  dob: string | null;
  notes: string;
  created_at: string;
}

export async function searchCustomers(query: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function fetchCustomerById(
  customerId: string
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchAllCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchCustomerReceipts(customerId: string) {
  const { data, error } = await supabase
    .from('receipts')
    .select('*, line_items(*)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertCustomer(
  name: string,
  phone: string
): Promise<Customer> {
  // Try to find an existing customer with the same name (case-insensitive)
  const { data: existing } = await supabase
    .from('customers')
    .select('*')
    .ilike('name', name)
    .limit(1)
    .single();

  if (existing) {
    // Update phone if it changed
    if (phone && phone !== existing.phone) {
      const { data: updated, error } = await supabase
        .from('customers')
        .update({ phone })
        .eq('id', existing.id)
        .select('*')
        .single();
      if (error) throw error;
      return updated;
    }
    return existing;
  }

  // Create new customer
  const { data: created, error } = await supabase
    .from('customers')
    .insert({ name, phone })
    .select('*')
    .single();
  if (error) throw error;
  return created;
}

export async function updateCustomer(
  customerId: string,
  updates: {
    name?: string;
    phone?: string;
    drivers_license?: string;
    address?: string;
    dob?: string | null;
    notes?: string;
  }
): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function uploadCustomerIdPhoto(
  customerId: string,
  imageUri: string
): Promise<string> {
  const fileName = `${customerId}_${Date.now()}.jpg`;

  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: 'base64',
  });

  const { error: uploadError } = await supabase.storage
    .from('customer-ids')
    .upload(fileName, decode(base64), {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from('customer-ids').getPublicUrl(fileName);

  // Save the URL to the customer record
  const { error: updateError } = await supabase
    .from('customers')
    .update({ dl_photo_uri: publicUrl })
    .eq('id', customerId);

  if (updateError) throw updateError;

  return publicUrl;
}
